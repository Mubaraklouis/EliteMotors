import { pool } from '../db';
import { User } from '../types';

function toUser(row: Record<string, unknown>): User {
  return {
    ...row,
    subscription_tier: row.role === 'dealer' ? 'premium' : 'free',
  } as User;
}

export async function findUserByEmail(
  email: string
): Promise<(User & { password_hash: string }) | null> {
  const result = await pool.query(
    `SELECT id, full_name, email, password_hash, role, phone, avatar_url,
            is_verified, is_active, created_at, updated_at
     FROM users
     WHERE email = $1 AND is_active = true`,
    [email]
  );
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return { ...toUser(row), password_hash: row.password_hash };
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, full_name, email, role, phone, avatar_url,
            is_verified, is_active, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  if (!result.rows[0]) return null;
  return toUser(result.rows[0]);
}

export async function createUser(data: {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'renter' | 'dealer';
  phone?: string;
}): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, role, phone, avatar_url,
               is_verified, is_active, created_at, updated_at`,
    [data.fullName, data.email, data.passwordHash, data.role, data.phone ?? null]
  );
  return toUser(result.rows[0]);
}

export async function updateUser(
  id: string,
  data: { fullName?: string; phone?: string }
): Promise<User> {
  const result = await pool.query(
    `UPDATE users
     SET full_name  = COALESCE($1, full_name),
         phone      = COALESCE($2, phone),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, full_name, email, role, phone, avatar_url,
               is_verified, is_active, created_at, updated_at`,
    [data.fullName ?? null, data.phone ?? null, id]
  );
  return toUser(result.rows[0]);
}
