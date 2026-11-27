import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.PGUSER || 'fincore'}:${
    process.env.PGPASSWORD || 'password'
  }@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || '5433'}/${
    process.env.PGDATABASE || 'fincore'
  }`;

export const pool = new Pool({
  connectionString,
  max: Number(process.env.PGPOOL_MAX || 10),
});

export async function verifyConnection(): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
}

export async function query<T = any>(
  text: string,
  params: any[] = [],
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export default pool;