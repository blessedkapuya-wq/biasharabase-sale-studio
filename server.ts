import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import express from 'express';
import type { Request, Response } from 'express';
import {
  activateDeviceForLicense,
  findLicenseByEmailAndOrder,
  findLicenseById,
  findLicenseByKey,
  isDeviceActivationStillValid,
  listLicensesWithCounts,
  resetLicenseDevices,
  updateLicenseStatus,
  upsertSelarPurchaseLicense,
} from './src/db/licenses.ts';
import { requireOwnerAuth, type AuthRequest } from './src/middleware/auth.ts';

const PORT = Number(process.env.PORT) || 3000;
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DEFAULT_APP_URL =
  'https://ais-pre-fsfsgf7dzzvymds4k2bdzx-975042813454.europe-west2.run.app';

interface SessionTokenPayload {
  scope: 'html-export';
  mode: 'license' | 'master';
  licenseId?: number;
  deviceId?: string;
  email?: string;
  iat: number;
  exp: number;
}

function getAppBaseUrl(): string {
  return (
    process.env.SHARED_APP_URL ||
    process.env.APP_URL ||
    DEFAULT_APP_URL
  ).replace(/\/+$/, '');
}

function getAllowedAccessCodes(): string[] {
  const configured =
    process.env.STUDIO_ACCESS_CODES ||
    process.env.STUDIO_ACCESS_CODE ||
    '';

  return configured
    .split(',')
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean);
}

function getSigningSecret(): string {
  return (
    process.env.STUDIO_TOKEN_SECRET ||
    process.env.STUDIO_ACCESS_CODE ||
    'biasharabase-studio-signing-key-v1'
  );
}

function getWebhookSecret(): string {
  return (
    process.env.SELAR_WEBHOOK_SECRET ||
    process.env.STUDIO_TOKEN_SECRET ||
    ''
  ).trim();
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function issueAccessToken(
  claims: Omit<SessionTokenPayload, 'scope' | 'iat' | 'exp'>
): string {
  const payload: SessionTokenPayload = {
    scope: 'html-export',
    ...claims,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString(
    'base64url'
  );
  const signature = crypto
    .createHmac('sha256', getSigningSecret())
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function parseAccessToken(token: string | undefined): SessionTokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(encodedPayload)
    .digest('base64url');

  if (!safeCompare(providedSig, expectedSig)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as Partial<SessionTokenPayload>;
    if (
      parsed.scope !== 'html-export' ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= Date.now()
    ) {
      return null;
    }
    return {
      scope: 'html-export',
      mode: parsed.mode === 'license' ? 'license' : 'master',
      licenseId: parsed.licenseId,
      deviceId: parsed.deviceId,
      email: parsed.email,
      iat: Number(parsed.iat) || 0,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

async function verifySessionToken(
  token: string | undefined
): Promise<{
  valid: boolean;
  payload: SessionTokenPayload | null;
  accessUrl?: string;
}> {
  const payload = parseAccessToken(token);
  if (!payload) {
    return { valid: false, payload: null };
  }

  if (payload.mode === 'license') {
    if (!payload.licenseId || !payload.deviceId) {
      return { valid: false, payload: null };
    }
    const active = await isDeviceActivationStillValid(
      payload.licenseId,
      payload.deviceId
    );
    if (!active) {
      return { valid: false, payload: null };
    }
    const license = await findLicenseById(payload.licenseId);
    const accessUrl = license
      ? `${getAppBaseUrl()}/?access=${encodeURIComponent(license.licenseKey)}`
      : undefined;
    return { valid: true, payload, accessUrl };
  }

  return { valid: true, payload };
}

function extractBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  return header.slice('Bearer '.length).trim();
}

function sanitizeDeviceId(raw: unknown): string {
  if (typeof raw === 'string') {
    const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
    if (cleaned.length >= 8) return cleaned;
  }
  return `dev_${crypto.randomBytes(12).toString('hex')}`;
}

function extractSelarField(
  body: Record<string, unknown>,
  keys: string[]
): string {
  const dataObj =
    body.data && typeof body.data === 'object'
      ? (body.data as Record<string, unknown>)
      : null;
  const customerObj =
    body.customer && typeof body.customer === 'object'
      ? (body.customer as Record<string, unknown>)
      : dataObj?.customer && typeof dataObj.customer === 'object'
        ? (dataObj.customer as Record<string, unknown>)
        : null;

  for (const key of keys) {
    for (const source of [body, dataObj, customerObj]) {
      if (!source) continue;
      const val = source[key];
      if (typeof val === 'string' && val.trim()) return val.trim();
      if (typeof val === 'number') return String(val);
    }
  }
  return '';
}

function pdfEscape(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function hexToRgbPdf(hex: string): string {
  const clean = hex.replace('#', '');
  const r = (parseInt(clean.slice(0, 2), 16) / 255).toFixed(3);
  const g = (parseInt(clean.slice(2, 4), 16) / 255).toFixed(3);
  const b = (parseInt(clean.slice(4, 6), 16) / 255).toFixed(3);
  return `${r} ${g} ${b}`;
}

function buildWelcomePdfBuffer(studioUrl: string, accessCode: string): Buffer {
  const cleanUrl = studioUrl.replace(/\/+$/, '');
  const autoUnlockUrl = `${cleanUrl}/?access=${encodeURIComponent(accessCode)}`;
  const supportEmail = 'blessedkapuya@gmail.com';
  const cmds: string[] = [];

  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    fillHex?: string,
    strokeHex?: string,
    strokeWidth = 1
  ) => {
    if (fillHex) cmds.push(`${hexToRgbPdf(fillHex)} rg`);
    if (strokeHex) cmds.push(`${strokeWidth} w ${hexToRgbPdf(strokeHex)} RG`);
    const op = fillHex && strokeHex ? 'B' : fillHex ? 'f' : 'S';
    cmds.push(`${x} ${y} ${w} ${h} re ${op}`);
  };

  const drawText = (
    x: number,
    y: number,
    str: string,
    size = 11,
    font: 'F1' | 'F2' = 'F1',
    color = '#0F172A'
  ) => {
    cmds.push(`${hexToRgbPdf(color)} rg`);
    cmds.push(`BT /${font} ${size} Tf ${x} ${y} Td (${pdfEscape(str)}) Tj ET`);
  };

  rect(0, 0, 612, 792, '#E8EEF5');
  rect(36, 36, 540, 720, '#F4F7FA', '#CFD9E4', 1);

  rect(36, 650, 540, 106, '#EDF2F7', '#CFD9E4', 1);
  rect(36, 750, 540, 6, '#0F766E');

  drawText(64, 714, 'BiasharaBase Page Studio', 22, 'F2', '#0F172A');
  drawText(64, 690, 'Welcome & Quick-Start Guide  |  Personal 3-Device License', 11, 'F1', '#0F766E');
  drawText(64, 668, 'Thank you for purchasing on Selar. Follow these 4 steps to launch your page.', 10, 'F1', '#475569');

  rect(64, 500, 484, 126, '#FAFCFE', '#0F766E', 1.2);
  drawText(82, 602, '1. Your Private Access Credentials (Up to 3 Devices)', 13, 'F2', '#0F172A');
  drawText(82, 578, 'Personal License Key (or unlock using your Selar Email + Order ID):', 10, 'F1', '#475569');
  rect(82, 551, 225, 22, '#E8EEF5', '#0F766E', 0.8);
  drawText(92, 558, accessCode, 11, 'F2', '#0F172A');
  drawText(82, 531, 'One-Click Unlock Link (opens & unlocks automatically):', 10, 'F1', '#475569');
  drawText(82, 514, autoUnlockUrl, 8.0, 'F2', '#0F766E');

  drawText(64, 466, '2. Create & Publish Your Sales Page Draft in Minutes', 13, 'F2', '#0F172A');

  const steps: Array<[string, string, string]> = [
    [
      'Step 1  Open & Unlock the Studio',
      'Click the One-Click Unlock Link above (or click Claim Purchase and enter your Selar',
      'Email + Order ID). Works on up to 3 browsers/devices without extra setup.',
    ],
    [
      'Step 2  Pick a Proven Template',
      'Choose "Test a New Idea" (Pre-Order & Waitlist) to validate demand, or choose',
      '"Sell an Offer" for Digital Products, Service Packages, or Workshop & Cohort pages.',
    ],
    [
      'Step 3  Enter Your Offer & Connect Inquiries',
      'Edit headlines, 4 key numbers, Before/After points, testimonials, FAQs, and photo.',
      'Paste your Selar/Paystack checkout link OR wire the form to Email, Formspree, or WhatsApp.',
    ],
    [
      'Step 4  Download Publish ZIP & Go Live',
      'Click "Download Publish ZIP" to get index.html with your photo and WhatsApp link inside.',
      'Drag the ZIP directly onto Netlify Drop, Cloudflare Pages, or cPanel—no renaming needed.',
    ],
  ];

  let yTop = 446;
  for (const [title, l1, l2] of steps) {
    rect(64, yTop - 64, 484, 62, '#FAFCFE', '#CFD9E4', 0.8);
    drawText(80, yTop - 20, title, 11, 'F2', '#0F172A');
    drawText(80, yTop - 36, l1, 9.5, 'F1', '#475569');
    drawText(80, yTop - 50, l2, 9.5, 'F1', '#475569');
    yTop -= 74;
  }

  rect(64, 64, 484, 72, '#EDF2F7', '#CFD9E4', 0.8);
  drawText(80, 114, '30-Day Guarantee & Support', 11, 'F2', '#0F172A');
  drawText(80, 96, `Need a device reset or help launching your page? Email ${supportEmail}`, 9.5, 'F1', '#475569');
  drawText(80, 80, `Builder URL: ${cleanUrl}`, 8.5, 'F1', '#0F766E');

  const contentStream = Buffer.from(cmds.join('\n'), 'latin1');

  const objects: Buffer[] = [
    Buffer.from('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n', 'latin1'),
    Buffer.from('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n', 'latin1'),
    Buffer.from(
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R /Annots [7 0 R 8 0 R] >>\nendobj\n',
      'latin1'
    ),
    Buffer.from(
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
      'latin1'
    ),
    Buffer.from(
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
      'latin1'
    ),
    Buffer.concat([
      Buffer.from(`6 0 obj\n<< /Length ${contentStream.length} >>\nstream\n`, 'latin1'),
      contentStream,
      Buffer.from('\nendstream\nendobj\n', 'latin1'),
    ]),
    Buffer.from(
      `7 0 obj\n<< /Type /Annot /Subtype /Link /Rect [78 508 545 526] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${pdfEscape(autoUnlockUrl)}) >> >>\nendobj\n`,
      'latin1'
    ),
    Buffer.from(
      `8 0 obj\n<< /Type /Annot /Subtype /Link /Rect [78 74 520 92] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${pdfEscape(cleanUrl)}) >> >>\nendobj\n`,
      'latin1'
    ),
  ];

  const header = Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'latin1');
  const parts: Buffer[] = [header];
  const offsets: number[] = [0];
  let cursor = header.length;

  for (const obj of objects) {
    offsets.push(cursor);
    parts.push(obj);
    cursor += obj.length;
  }

  const xrefOffset = cursor;
  const xrefLines = [`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`];
  for (let i = 1; i < offsets.length; i++) {
    xrefLines.push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }
  const xrefBuf = Buffer.from(xrefLines.join(''), 'latin1');
  const trailerBuf = Buffer.from(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
    'latin1'
  );

  return Buffer.concat([...parts, xrefBuf, trailerBuf]);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/favicon.ico', (_req: Request, res: Response) => {
    res.status(204).end();
  });

  // Selar "New Sale" Webhook Receiver
  app.post('/api/selar-webhook', async (req: Request, res: Response) => {
    const expectedSecret = getWebhookSecret();
    const providedSecret =
      (typeof req.query.secret === 'string' ? req.query.secret : '') ||
      (typeof req.headers['x-webhook-secret'] === 'string'
        ? req.headers['x-webhook-secret']
        : '') ||
      extractBearerToken(req) ||
      '';

    if (!expectedSecret || !providedSecret || !safeCompare(providedSecret, expectedSecret)) {
      res.status(401).json({ error: 'Invalid webhook secret.' });
      return;
    }

    const body =
      req.body && typeof req.body === 'object'
        ? (req.body as Record<string, unknown>)
        : {};

    const rawStatus = extractSelarField(body, [
      'status',
      'payment_status',
      'transaction_status',
    ]).toLowerCase();

    if (
      rawStatus &&
      ['failed', 'cancelled', 'canceled', 'abandoned', 'pending'].includes(rawStatus)
    ) {
      res.json({ ok: true, ignored: true, reason: `Status ${rawStatus} ignored.` });
      return;
    }

    const buyerEmail = extractSelarField(body, [
      'email',
      'customer_email',
      'buyer_email',
    ]);
    const buyerName = extractSelarField(body, [
      'name',
      'fullname',
      'full_name',
      'customer_name',
      'buyer_name',
    ]);
    const selarOrderId = extractSelarField(body, [
      'order_id',
      'transaction_reference',
      'reference',
      'tx_ref',
      'order_number',
      'id',
    ]);
    const amountPaid = extractSelarField(body, ['amount', 'price', 'total']);
    const currency = extractSelarField(body, ['currency']) || 'USD';

    if (!buyerEmail || !selarOrderId) {
      res.status(400).json({
        error: 'Webhook payload missing buyer email or Selar order ID.',
      });
      return;
    }

    try {
      const license = await upsertSelarPurchaseLicense({
        buyerEmail,
        buyerName,
        selarOrderId,
        amountPaid,
        currency,
        source: 'selar-webhook',
      });

      const accessUrl = `${getAppBaseUrl()}/?access=${encodeURIComponent(
        license.licenseKey
      )}`;

      res.json({
        ok: true,
        licenseKey: license.licenseKey,
        accessUrl,
        buyerEmail: license.buyerEmail,
        selarOrderId: license.selarOrderId,
        maxDevices: license.maxDevices,
      });
    } catch (err: unknown) {
      console.error('Selar webhook error:', err);
      res.status(500).json({ error: 'Failed to store Selar purchase.' });
    }
  });

  // Unlock with Personal License Key OR Master Code
  app.post('/api/access/verify', async (req: Request, res: Response) => {
    const rawCode =
      typeof req.body?.code === 'string' ? req.body.code.trim().toUpperCase() : '';
    const deviceId = sanitizeDeviceId(req.body?.deviceId);
    const userAgent = String(req.headers['user-agent'] || '');

    if (!rawCode) {
      res.status(400).json({
        valid: false,
        error: 'Enter your personal license code or access link.',
      });
      return;
    }

    try {
      const license = await findLicenseByKey(rawCode);
      if (license) {
        const activation = await activateDeviceForLicense({
          license,
          deviceId,
          userAgent,
        });

        if (!activation.allowed) {
          res.status(403).json({
            valid: false,
            error: activation.reason,
            deviceCount: activation.deviceCount,
            maxDevices: activation.maxDevices,
          });
          return;
        }

        const token = issueAccessToken({
          mode: 'license',
          licenseId: license.id,
          deviceId,
          email: license.buyerEmail,
        });
        const accessUrl = `${getAppBaseUrl()}/?access=${encodeURIComponent(
          license.licenseKey
        )}`;

        res.json({
          valid: true,
          token,
          deviceId,
          mode: 'license',
          buyerEmail: license.buyerEmail,
          licenseKey: license.licenseKey,
          accessUrl,
          deviceCount: activation.deviceCount,
          maxDevices: activation.maxDevices,
        });
        return;
      }

      const allowed = getAllowedAccessCodes();
      const matched = allowed.some((expected) => safeCompare(rawCode, expected));

      if (!matched) {
        res.status(401).json({
          valid: false,
          error:
            'That license key was not recognized. If you just paid on Selar, use "Claim Purchase" with your Email + Selar Order ID.',
        });
        return;
      }

      const token = issueAccessToken({ mode: 'master' });
      res.json({
        valid: true,
        token,
        deviceId,
        mode: 'master',
      });
    } catch (err: unknown) {
      console.error('Access verify error:', err);
      res.status(500).json({
        valid: false,
        error: 'Unable to verify access right now. Please try again.',
      });
    }
  });

  // Unlock Right After Selar Payment using Email + Order ID
  app.post('/api/access/verify-purchase', async (req: Request, res: Response) => {
    const email =
      typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const orderId =
      typeof req.body?.orderId === 'string' ? req.body.orderId.trim() : '';
    const deviceId = sanitizeDeviceId(req.body?.deviceId);
    const userAgent = String(req.headers['user-agent'] || '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({
        valid: false,
        error: 'Enter the email address you used on Selar.',
      });
      return;
    }

    if (!orderId) {
      res.status(400).json({
        valid: false,
        error: 'Enter your Selar Order ID or Transaction Reference from your receipt.',
      });
      return;
    }

    try {
      const license = await findLicenseByEmailAndOrder(email, orderId);
      if (!license) {
        res.status(404).json({
          valid: false,
          pending: true,
          error:
            'No matching Selar purchase found yet. If you completed payment a few seconds ago, wait 5 seconds and try again, or verify your Order ID from your Selar email receipt.',
        });
        return;
      }

      const activation = await activateDeviceForLicense({
        license,
        deviceId,
        userAgent,
      });

      if (!activation.allowed) {
        res.status(403).json({
          valid: false,
          error: activation.reason,
          deviceCount: activation.deviceCount,
          maxDevices: activation.maxDevices,
        });
        return;
      }

      const token = issueAccessToken({
        mode: 'license',
        licenseId: license.id,
        deviceId,
        email: license.buyerEmail,
      });
      const accessUrl = `${getAppBaseUrl()}/?access=${encodeURIComponent(
        license.licenseKey
      )}`;

      res.json({
        valid: true,
        token,
        deviceId,
        mode: 'license',
        buyerEmail: license.buyerEmail,
        licenseKey: license.licenseKey,
        accessUrl,
        deviceCount: activation.deviceCount,
        maxDevices: activation.maxDevices,
      });
    } catch (err: unknown) {
      console.error('Purchase verification error:', err);
      res.status(500).json({
        valid: false,
        error: 'Unable to verify purchase right now. Please try again.',
      });
    }
  });

  app.get('/api/access/status', async (req: Request, res: Response) => {
    try {
      const token = extractBearerToken(req);
      const result = await verifySessionToken(token);
      res.json({
        unlocked: result.valid,
        mode: result.payload?.mode,
        buyerEmail: result.payload?.email,
        accessUrl: result.accessUrl,
      });
    } catch (err: unknown) {
      console.error('Status check error:', err);
      res.json({ unlocked: false });
    }
  });

  app.get('/api/welcome-pdf', async (req: Request, res: Response) => {
    try {
      const token = extractBearerToken(req);
      const verification = await verifySessionToken(token);
      if (!verification.valid || !verification.payload) {
        res.status(401).json({ error: 'Authorized access required.' });
        return;
      }

      let codeForPdf = getAllowedAccessCodes()[0] || 'BBPS-PERSONAL-LICENSE';
      if (verification.payload.licenseId) {
        const lic = await findLicenseById(verification.payload.licenseId);
        if (lic) codeForPdf = lic.licenseKey;
      }

      const pdfBuffer = buildWelcomePdfBuffer(getAppBaseUrl(), codeForPdf);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="BiasharaBase-Page-Studio-Welcome.pdf"'
      );
      res.send(pdfBuffer);
    } catch (err: unknown) {
      console.error('Welcome PDF error:', err);
      res.status(500).json({ error: 'Failed to generate Welcome PDF.' });
    }
  });

  // Owner License Manager Routes (Firebase ID Token verified + owner email enforced)
  app.get('/api/owner/licenses', requireOwnerAuth, async (_req: AuthRequest, res: Response) => {
    try {
      const rows = await listLicensesWithCounts();
      const baseUrl = getAppBaseUrl();
      const webhookSecret = getWebhookSecret();
      const webhookUrl = webhookSecret
        ? `${baseUrl}/api/selar-webhook?secret=${encodeURIComponent(webhookSecret)}`
        : `${baseUrl}/api/selar-webhook`;
      const redirectUrl = `${baseUrl}/?paid=1`;

      res.json({
        webhookUrl,
        redirectUrl,
        licenses: rows.map((row) => ({
          ...row,
          accessUrl: `${baseUrl}/?access=${encodeURIComponent(row.licenseKey)}`,
        })),
      });
    } catch (err: unknown) {
      console.error('Owner list licenses error:', err);
      res.status(500).json({ error: 'Failed to load licenses.' });
    }
  });

  app.post('/api/owner/licenses', requireOwnerAuth, async (req: AuthRequest, res: Response) => {
    const buyerEmail =
      typeof req.body?.buyerEmail === 'string'
        ? req.body.buyerEmail.trim().toLowerCase()
        : '';
    const buyerName =
      typeof req.body?.buyerName === 'string' ? req.body.buyerName.trim() : '';
    const orderId =
      typeof req.body?.orderId === 'string' && req.body.orderId.trim()
        ? req.body.orderId.trim()
        : `MANUAL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      res.status(400).json({ error: 'Enter a valid buyer email address.' });
      return;
    }

    try {
      const license = await upsertSelarPurchaseLicense({
        buyerEmail,
        buyerName,
        selarOrderId: orderId,
        amountPaid: typeof req.body?.amountPaid === 'string' ? req.body.amountPaid : 'manual',
        currency: 'USD',
        source: 'owner-manual',
      });
      res.json({
        license: {
          ...license,
          deviceCount: 0,
          accessUrl: `${getAppBaseUrl()}/?access=${encodeURIComponent(
            license.licenseKey
          )}`,
        },
      });
    } catch (err: unknown) {
      console.error('Owner issue license error:', err);
      res.status(500).json({ error: 'Failed to create personal license.' });
    }
  });

  app.patch(
    '/api/owner/licenses/:id/status',
    requireOwnerAuth,
    async (req: AuthRequest, res: Response) => {
      const id = Number(req.params.id);
      const status = req.body?.status === 'revoked' ? 'revoked' : 'active';
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid license ID.' });
        return;
      }

      try {
        const updated = await updateLicenseStatus(id, status);
        if (!updated) {
          res.status(404).json({ error: 'License not found.' });
          return;
        }
        res.json({ license: updated });
      } catch (err: unknown) {
        console.error('Owner status toggle error:', err);
        res.status(500).json({ error: 'Failed to update license status.' });
      }
    }
  );

  app.post(
    '/api/owner/licenses/:id/reset-devices',
    requireOwnerAuth,
    async (req: AuthRequest, res: Response) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid license ID.' });
        return;
      }

      try {
        await resetLicenseDevices(id);
        res.json({ ok: true });
      } catch (err: unknown) {
        console.error('Owner reset devices error:', err);
        res.status(500).json({ error: 'Failed to reset device slots.' });
      }
    }
  );

  const httpServer = http.createServer(app);
  const isProduction = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(process.cwd(), 'dist');

  if (isProduction && fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        allowedHosts: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`BiasharaBase Page Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
