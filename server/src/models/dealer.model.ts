import { pool } from '../db';
import { Dealer } from '../types';

export async function createDealer(data: {
  userId: string;
  businessName: string;
  city?: string;
  description?: string;
}): Promise<Dealer> {
  const result = await pool.query(
    `INSERT INTO dealers (user_id, business_name, city, description, address, country)
     VALUES ($1, $2, $3, $4, '', 'NG')
     RETURNING *`,
    [
      data.userId,
      data.businessName,
      data.city ?? '',
      data.description ?? null,
    ]
  );
  return result.rows[0] as Dealer;
}

export async function findDealerByUserId(userId: string): Promise<Dealer | null> {
  const result = await pool.query(
    `SELECT d.*, u.phone, u.full_name AS owner_name
     FROM dealers d
     JOIN users u ON u.id = d.user_id
     WHERE d.user_id = $1`,
    [userId]
  );
  return (result.rows[0] as Dealer) ?? null;
}

export async function findDealerById(id: string): Promise<Dealer | null> {
  const result = await pool.query(
    `SELECT d.*, u.phone, u.full_name AS owner_name
     FROM dealers d
     JOIN users u ON u.id = d.user_id
     WHERE d.id = $1`,
    [id]
  );
  return (result.rows[0] as Dealer) ?? null;
}

export async function updateDealer(
  id: string,
  data: {
    businessName?: string;
    city?: string;
    description?: string;
  }
): Promise<Dealer> {
  const result = await pool.query(
    `UPDATE dealers
     SET business_name = COALESCE($1, business_name),
         city          = COALESCE($2, city),
         description   = COALESCE($3, description),
         updated_at    = NOW()
     WHERE id = $4
     RETURNING *`,
    [data.businessName ?? null, data.city ?? null, data.description ?? null, id]
  );
  return result.rows[0] as Dealer;
}
