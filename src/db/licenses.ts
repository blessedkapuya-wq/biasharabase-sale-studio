import crypto from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './index.ts';
import { deviceActivations, licenses } from './schema.ts';

export interface LicenseRecord {
  id: number;
  buyerEmail: string;
  buyerName: string;
  selarOrderId: string;
  licenseKey: string;
  amountPaid: string;
  currency: string;
  status: string;
  maxDevices: number;
  source: string;
  createdAt: Date;
}

export interface LicenseWithDeviceCount extends LicenseRecord {
  deviceCount: number;
}

export function generatePersonalLicenseKey(): string {
  const seg1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const seg2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const seg3 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BBPS-${seg1}-${seg2}-${seg3}`;
}

export async function upsertSelarPurchaseLicense(input: {
  buyerEmail: string;
  buyerName: string;
  selarOrderId: string;
  amountPaid: string;
  currency: string;
  source?: string;
}): Promise<LicenseRecord> {
  const normalizedEmail = input.buyerEmail.trim().toLowerCase();
  const normalizedOrderId = input.selarOrderId.trim();
  const cleanName = input.buyerName.trim().slice(0, 140);
  const generatedKey = generatePersonalLicenseKey();

  try {
    const rows = await db
      .insert(licenses)
      .values({
        buyerEmail: normalizedEmail,
        buyerName: cleanName,
        selarOrderId: normalizedOrderId,
        licenseKey: generatedKey,
        amountPaid: input.amountPaid.trim().slice(0, 40),
        currency: input.currency.trim().toUpperCase().slice(0, 12) || 'USD',
        status: 'active',
        maxDevices: 3,
        source: input.source || 'selar-webhook',
      })
      .onConflictDoUpdate({
        target: licenses.selarOrderId,
        set: {
          buyerEmail: normalizedEmail,
          buyerName: cleanName,
        },
      })
      .returning();

    return rows[0];
  } catch (error) {
    console.error('Database license upsert failed:', error);
    throw new Error('Failed to record license. Please try again later.', {
      cause: error,
    });
  }
}

export async function findLicenseByKey(
  licenseKey: string
): Promise<LicenseRecord | null> {
  const cleanKey = licenseKey.trim().toUpperCase();
  try {
    const rows = await db
      .select()
      .from(licenses)
      .where(eq(licenses.licenseKey, cleanKey))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Database license lookup by key failed:', error);
    throw new Error('Failed to verify license key. Please try again later.', {
      cause: error,
    });
  }
}

export async function findLicenseByEmailAndOrder(
  email: string,
  orderId: string
): Promise<LicenseRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOrder = orderId.trim();
  try {
    const rows = await db
      .select()
      .from(licenses)
      .where(
        and(
          eq(licenses.buyerEmail, cleanEmail),
          eq(licenses.selarOrderId, cleanOrder)
        )
      )
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Database license lookup by email/order failed:', error);
    throw new Error('Failed to verify Selar purchase. Please try again later.', {
      cause: error,
    });
  }
}

export async function findLicenseById(id: number): Promise<LicenseRecord | null> {
  try {
    const rows = await db
      .select()
      .from(licenses)
      .where(eq(licenses.id, id))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Database license lookup by id failed:', error);
    throw new Error('Failed to verify license.', { cause: error });
  }
}

export async function activateDeviceForLicense(input: {
  license: LicenseRecord;
  deviceId: string;
  userAgent: string;
}): Promise<
  | { allowed: true; deviceCount: number; maxDevices: number }
  | { allowed: false; reason: string; deviceCount: number; maxDevices: number }
> {
  const { license, deviceId, userAgent } = input;
  if (license.status !== 'active') {
    return {
      allowed: false,
      reason:
        'This license has been revoked or deactivated. Contact blessedkapuya@gmail.com for help.',
      deviceCount: 0,
      maxDevices: license.maxDevices,
    };
  }

  try {
    const existing = await db
      .select()
      .from(deviceActivations)
      .where(
        and(
          eq(deviceActivations.licenseId, license.id),
          eq(deviceActivations.deviceId, deviceId)
        )
      )
      .limit(1);

    if (existing[0]) {
      await db
        .update(deviceActivations)
        .set({
          lastSeenAt: new Date(),
          userAgent: userAgent.slice(0, 240),
        })
        .where(eq(deviceActivations.id, existing[0].id));

      const countRows = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(deviceActivations)
        .where(eq(deviceActivations.licenseId, license.id));

      return {
        allowed: true,
        deviceCount: countRows[0]?.count ?? 1,
        maxDevices: license.maxDevices,
      };
    }

    const countRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(deviceActivations)
      .where(eq(deviceActivations.licenseId, license.id));

    const currentCount = countRows[0]?.count ?? 0;

    if (currentCount >= license.maxDevices) {
      return {
        allowed: false,
        reason: `This license has reached its ${license.maxDevices}-device limit (${currentCount}/${license.maxDevices} browsers active). Contact blessedkapuya@gmail.com if you need a device reset.`,
        deviceCount: currentCount,
        maxDevices: license.maxDevices,
      };
    }

    await db
      .insert(deviceActivations)
      .values({
        licenseId: license.id,
        deviceId,
        userAgent: userAgent.slice(0, 240),
      })
      .onConflictDoUpdate({
        target: [deviceActivations.licenseId, deviceActivations.deviceId],
        set: { lastSeenAt: new Date() },
      });

    return {
      allowed: true,
      deviceCount: currentCount + 1,
      maxDevices: license.maxDevices,
    };
  } catch (error) {
    console.error('Database device activation failed:', error);
    throw new Error('Failed to activate device. Please try again later.', {
      cause: error,
    });
  }
}

export async function isDeviceActivationStillValid(
  licenseId: number,
  deviceId: string
): Promise<boolean> {
  try {
    const licRows = await db
      .select({ status: licenses.status })
      .from(licenses)
      .where(eq(licenses.id, licenseId))
      .limit(1);
    if (!licRows[0] || licRows[0].status !== 'active') return false;

    const actRows = await db
      .select({ id: deviceActivations.id })
      .from(deviceActivations)
      .where(
        and(
          eq(deviceActivations.licenseId, licenseId),
          eq(deviceActivations.deviceId, deviceId)
        )
      )
      .limit(1);

    return Boolean(actRows[0]);
  } catch (error) {
    console.error('Database activation check failed:', error);
    throw new Error('Failed to validate license session.', { cause: error });
  }
}

export async function listLicensesWithCounts(): Promise<
  LicenseWithDeviceCount[]
> {
  try {
    const rows = await db
      .select({
        id: licenses.id,
        buyerEmail: licenses.buyerEmail,
        buyerName: licenses.buyerName,
        selarOrderId: licenses.selarOrderId,
        licenseKey: licenses.licenseKey,
        amountPaid: licenses.amountPaid,
        currency: licenses.currency,
        status: licenses.status,
        maxDevices: licenses.maxDevices,
        source: licenses.source,
        createdAt: licenses.createdAt,
        deviceCount: sql<number>`count(${deviceActivations.id})::int`,
      })
      .from(licenses)
      .leftJoin(deviceActivations, eq(licenses.id, deviceActivations.licenseId))
      .groupBy(licenses.id)
      .orderBy(desc(licenses.createdAt));

    return rows;
  } catch (error) {
    console.error('Database list licenses failed:', error);
    throw new Error('Failed to load licenses.', { cause: error });
  }
}

export async function updateLicenseStatus(
  licenseId: number,
  status: 'active' | 'revoked'
): Promise<LicenseRecord | null> {
  try {
    const rows = await db
      .update(licenses)
      .set({ status })
      .where(eq(licenses.id, licenseId))
      .returning();
    return rows[0] || null;
  } catch (error) {
    console.error('Database update license status failed:', error);
    throw new Error('Failed to update license status.', { cause: error });
  }
}

export async function resetLicenseDevices(licenseId: number): Promise<void> {
  try {
    await db
      .delete(deviceActivations)
      .where(eq(deviceActivations.licenseId, licenseId));
  } catch (error) {
    console.error('Database reset license devices failed:', error);
    throw new Error('Failed to reset device slots.', { cause: error });
  }
}
