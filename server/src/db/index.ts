import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function connectDB(): Promise<void> {
  const client = await pool.connect();
  const result = await client.query('SELECT NOW()');
  console.log(`✅ PostgreSQL connected — ${result.rows[0].now}`);
  client.release();
}
