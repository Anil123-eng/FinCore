import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { pool, query, verifyConnection } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Minimal CORS for the deployed frontend (reflects the request origin).
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

type Customer = { id: number; name: string; email: string };

declare global {
  namespace Express {
    interface Request {
      customer?: Customer;
    }
  }
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const rows = await query<Customer & { expires_at: string }>(
      `SELECT c.id, c.name, c.email, s.expires_at
       FROM sessions s JOIN customers c ON c.id = s.customer_id
       WHERE s.token = $1`,
      [token],
    );
    if (rows.length === 0 || new Date(rows[0].expires_at) < new Date()) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    req.customer = { id: rows[0].id, name: rows[0].name, email: rows[0].email };
    next();
  } catch (err) {
    next(err);
  }
}

function newToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

app.get('/api/health', async (_req: Request, res: Response) => {
  let db = false;
  try {
    db = await verifyConnection();
  } catch {
    db = false;
  }
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'fincore-backend',
    database: db ? 'up' : 'down',
  });
});

app.post('/api/customers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      res.status(400).json({ error: 'name, email and password are required' });
      return;
    }
    const existing = await query('SELECT id FROM customers WHERE email = $1', [email]);
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const passwordHash = hashPassword(password);
    const inserted = await query<Customer>(
      `INSERT INTO customers (name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, name, email`,
      [name, email, passwordHash],
    );
    const customer = inserted[0];
    await query(
      `INSERT INTO accounts (name, type, currency, balance, customer_id)
       VALUES ($1, 'asset', 'USD', 0, $2)`,
      [`${name}'s Wallet`, customer.id],
    );
    const token = newToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 12);
    await query(
      `INSERT INTO sessions (token, customer_id, expires_at) VALUES ($1, $2, $3)`,
      [token, customer.id, expires.toISOString()],
    );
    res.status(201).json({ success: true, customer, token });
  } catch (err) {
    next(err);
  }
});

app.post('/api/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }
    const rows = await query<Customer & { password_hash: string }>(
      'SELECT id, name, email, password_hash FROM customers WHERE email = $1',
      [email],
    );
    if (rows.length === 0 || !verifyPassword(password, rows[0].password_hash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const customer: Customer = { id: rows[0].id, name: rows[0].name, email: rows[0].email };
    const token = newToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 12);
    await query(
      `INSERT INTO sessions (token, customer_id, expires_at) VALUES ($1, $2, $3)`,
      [token, customer.id, expires.toISOString()],
    );
    res.json({ success: true, customer, token });
  } catch (err) {
    next(err);
  }
});

app.post('/api/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    await query('DELETE FROM sessions WHERE token = $1', [token]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.get('/api/accounts', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query(
      `SELECT id, name, type, currency, balance, is_active
       FROM accounts WHERE customer_id = $1 ORDER BY id`,
      [req.customer!.id],
    );
    res.json({ accounts: rows });
  } catch (err) {
    next(err);
  }
});

app.get('/api/wallets', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query(
      `SELECT id, name, type, currency, balance
       FROM accounts WHERE customer_id = $1 AND type = 'asset' ORDER BY id`,
      [req.customer!.id],
    );
    res.json({ wallets: rows });
  } catch (err) {
    next(err);
  }
});

app.get('/api/beneficiaries', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query(
      `SELECT id, name, account FROM beneficiaries WHERE customer_id = $1 ORDER BY id`,
      [req.customer!.id],
    );
    res.json({ beneficiaries: rows });
  } catch (err) {
    next(err);
  }
});

app.post('/api/beneficiaries', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, account } = req.body || {};
    if (!name || !account) {
      res.status(400).json({ error: 'name and account are required' });
      return;
    }
    const rows = await query(
      `INSERT INTO beneficiaries (customer_id, name, account)
       VALUES ($1, $2, $3) RETURNING id, name, account`,
      [req.customer!.id, name, account],
    );
    res.status(201).json({ success: true, beneficiary: rows[0] });
  } catch (err) {
    next(err);
  }
});

app.post('/api/transfers', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const client = await pool.connect();
  try {
    const { from, to, amount } = req.body || {};
    const value = Number(amount);
    if (!from || !to || !(value > 0)) {
      client.release();
      res.status(400).json({ error: 'from, to and a positive amount are required' });
      return;
    }
    if (String(from) === String(to)) {
      client.release();
      res.status(400).json({ error: 'from and to must differ' });
      return;
    }
    await client.query('BEGIN');
    const fromAcc = await client.query(
      `SELECT id, balance FROM accounts WHERE id = $1 AND customer_id = $2 FOR UPDATE`,
      [from, req.customer!.id],
    );
    const toAcc = await client.query(
      `SELECT id FROM accounts WHERE id = $1 AND customer_id = $2 FOR UPDATE`,
      [to, req.customer!.id],
    );
    if (fromAcc.rows.length === 0 || toAcc.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      res.status(404).json({ error: 'Account not found for this customer' });
      return;
    }
    if (Number(fromAcc.rows[0].balance) < value) {
      await client.query('ROLLBACK');
      client.release();
      res.status(400).json({ error: 'Insufficient funds' });
      return;
    }
    const txn = await client.query(
      `INSERT INTO ledger_transactions (description, status)
       VALUES ($1, 'completed') RETURNING id`,
      [`Transfer ${from} -> ${to}`],
    );
    const txnId = txn.rows[0].id;
    await client.query(
      `INSERT INTO ledger_entries (transaction_id, account_id, entry_type, amount)
       VALUES ($1, $2, 'debit', $3)`,
      [txnId, from, value],
    );
    await client.query(
      `INSERT INTO ledger_entries (transaction_id, account_id, entry_type, amount)
       VALUES ($1, $2, 'credit', $3)`,
      [txnId, to, value],
    );
    const transfer = await client.query(
      `INSERT INTO transfers (customer_id, from_account, to_account, amount, status)
       VALUES ($1, $2, $3, $4, 'completed') RETURNING id, from_account, to_account, amount, status, created_at`,
      [req.customer!.id, from, to, value],
    );
    await client.query('COMMIT');
    client.release();
    res.status(201).json({ success: true, transfer: transfer.rows[0] });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    client.release();
    next(err);
  }
});

app.get('/api/transactions', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query(
      `SELECT t.id, t.from_account, t.to_account, t.amount, t.status, t.created_at
       FROM transfers t WHERE t.customer_id = $1 ORDER BY t.id DESC`,
      [req.customer!.id],
    );
    res.json({ transactions: rows });
  } catch (err) {
    next(err);
  }
});

app.post('/api/disputes', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId, reason } = req.body || {};
    if (!transactionId || !reason) {
      res.status(400).json({ error: 'transactionId and reason are required' });
      return;
    }
    const rows = await query(
      `INSERT INTO disputes (customer_id, transaction_id, reason, status)
       VALUES ($1, $2, $3, 'under_review') RETURNING id, transaction_id, reason, status`,
      [req.customer!.id, transactionId, reason],
    );
    res.status(201).json({ success: true, dispute: rows[0] });
  } catch (err) {
    next(err);
  }
});

app.get('/api/statements', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txns = await query(
      `SELECT id, amount, status, created_at FROM transfers WHERE customer_id = $1 ORDER BY id`,
      [req.customer!.id],
    );
    const accounts = await query(
      `SELECT balance FROM accounts WHERE customer_id = $1 AND type = 'asset'`,
      [req.customer!.id],
    );
    const closing = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
    res.json({
      statement: {
        period: 'Current',
        closingBalance: closing.toFixed(2),
        transactions: txns,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Payment stubs preserved (simulated, no provider). Auth required.
app.post('/api/payment-intents', authenticate, (req: Request, res: Response) => {
  const { amount, currency } = req.body || {};
  res.json({ success: true, payment_intent: { id: 'PI-' + Date.now(), amount: amount ?? '(simulated)', currency: currency || 'USD', status: 'created' } });
});
app.post('/api/refunds', authenticate, (req: Request, res: Response) => {
  const { transferId, amount } = req.body || {};
  res.json({ success: true, refund: { id: 'RFD-' + Date.now(), transferId, amount: amount ?? '(simulated)', status: 'processed' } });
});
app.post('/api/reversals', authenticate, (req: Request, res: Response) => {
  const { transferId } = req.body || {};
  res.json({ success: true, reversal: { id: 'REV-' + Date.now(), transferId, status: 'reversed' } });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(_err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app };
export default app;