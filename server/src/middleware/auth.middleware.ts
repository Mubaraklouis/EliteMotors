import { Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { User } from '../types';

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'Unauthorized — no token', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    const result = await pool.query(
      `SELECT id, full_name, email, role, phone, avatar_url, is_verified, is_active, created_at, updated_at
       FROM users WHERE id = $1 AND is_active = true`,
      [payload.userId]
    );

    if (!result.rows[0]) {
      sendError(res, 'Unauthorized — user not found', 401);
      return;
    }

    const row = result.rows[0];
    req.user = {
      ...row,
      subscription_tier: row.role === 'dealer' ? 'premium' : 'free',
    } as User;

    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
}

export function requireDealer(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== 'dealer' && req.user?.role !== 'admin') {
    sendError(res, 'Dealer account required to perform this action', 403);
    return;
  }
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== 'admin') {
    sendError(res, 'Admin access required', 403);
    return;
  }
  next();
}
