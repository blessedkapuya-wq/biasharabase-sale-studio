import type { NextFunction, Request, Response } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getOrCreateUser } from '../db/users.ts';

export const OWNER_EMAIL = (
  process.env.OWNER_ADMIN_EMAIL || 'blessedkapuya@gmail.com'
)
  .trim()
  .toLowerCase();

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export async function requireOwnerAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Sign in required.' });
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = (decoded.email || '').trim().toLowerCase();
    if (!email || !decoded.email_verified || email !== OWNER_EMAIL) {
      res
        .status(403)
        .json({ error: 'Forbidden: Only the store owner account can access licenses.' });
      return;
    }

    await getOrCreateUser(decoded.uid, email);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Owner auth verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session.' });
  }
}
