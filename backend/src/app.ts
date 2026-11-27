import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware: JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'fincore-backend'
  });
});

// Customer endpoints
app.post('/api/customers', (req: Request, res: Response) => {
  const { name, email, address } = req.body;
  res.json({
    success: true,
    customer: {
      id: 'CUST-' + Date.now(),
      name,
      email,
      address,
      created: new Date().toISOString()
    }
  });
});

// Account endpoints
app.get('/api/accounts', (_req: Request, res: Response) => {
  res.json({
    accounts: [
      { id: 'ACCT-001', type: 'checking', balance: '(simulated)' }
    ]
  });
});

// Wallet endpoints
app.get('/api/wallets', (_req: Request, res: Response) => {
  res.json({
    wallets: [
      { id: '1', name: 'Wallet 1', balance: '(simulated)' },
      { id: '2', name: 'Wallet 2', balance: '(simulated)' }
    ]
  });
});

// Beneficiary endpoints
app.get('/api/beneficiaries', (_req: Request, res: Response) => {
  res.json({
    beneficiaries: [
      { id: '1', name: 'Beneficiary 1', account: 'ACC-001' }
    ]
  });
});

// Transfer endpoints
app.post('/api/transfers', (req: Request, res: Response) => {
  const { from, to, amount } = req.body;
  res.json({
    success: true,
    transfer: {
      id: 'TRANS-' + Date.now(),
      from,
      to,
      amount: '(simulated)',
      status: 'completed'
    }
  });
});

// Payment intent endpoints
app.post('/api/payment-intents', (req: Request, res: Response) => {
  const { amount, currency } = req.body;
  res.json({
    success: true,
    payment_intent: {
      id: 'PI-' + Date.now(),
      amount: '(simulated)',
      currency: currency || 'USD',
      status: 'created'
    }
  });
});

// Refund endpoints
app.post('/api/refunds', (req: Request, res: Response) => {
  const { transferId, amount } = req.body;
  res.json({
    success: true,
    refund: {
      id: 'RFD-' + Date.now(),
      transferId,
      amount: '(simulated)',
      status: 'processed'
    }
  });
});

// Reversal endpoints
app.post('/api/reversals', (req: Request, res: Response) => {
  const { transferId } = req.body;
  res.json({
    success: true,
    reversal: {
      id: 'REV-' + Date.now(),
      transferId,
      status: 'reversed'
    }
  });
});

// Dispute endpoints
app.post('/api/disputes', (req: Request, res: Response) => {
  const { transactionId, reason } = req.body;
  res.json({
    success: true,
    dispute: {
      id: 'DIS-' + Date.now(),
      transactionId,
      reason,
      status: 'under_review'
    }
  });
});

// Statement endpoints
app.get('/api/statements', (_req: Request, res: Response) => {
  res.json({
    statement: {
      period: '2026-11-01 to 2026-11-30',
      openingBalance: '(simulated)',
      closingBalance: '(simulated)',
      transactions: [
        { id: 'TXN-20261127-001', type: 'transfer', from: 'Wallet 1', to: 'Wallet 2', amount: '(simulated)', status: 'completed', date: '2026-11-27' }
      ]
    }
  });
});

// 404 handler — must be after all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Basic error-handling middleware
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(_err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Export app for separation of app config from server startup
export { app };
export default app;