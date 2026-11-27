-- Migration: 002_customer_auth_and_resources
-- Adds customer identity, sessions, and customer-scoped financial resources.
-- Extends the existing double-entry ledger (001) without altering it.

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions (token lifecycle with expiry)
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link ledger accounts to a customer (wallets are asset accounts)
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE;

-- Beneficiaries (customer-scoped)
CREATE TABLE IF NOT EXISTS beneficiaries (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    account VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transfers (customer-scoped record of wallet-to-wallet movements)
CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    from_account INTEGER NOT NULL REFERENCES accounts(id),
    to_account INTEGER NOT NULL REFERENCES accounts(id),
    amount NUMERIC(19, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disputes (customer-scoped)
CREATE TABLE IF NOT EXISTS disputes (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'under_review',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accounts_customer ON accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_customer ON beneficiaries(customer_id);
CREATE INDEX IF NOT EXISTS idx_transfers_customer ON transfers(customer_id);
CREATE INDEX IF NOT EXISTS idx_disputes_customer ON disputes(customer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_customer ON sessions(customer_id);