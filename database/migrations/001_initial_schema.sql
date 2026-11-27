-- Migration: 001_initial_schema
-- Create accounts and ledger tables for double-entry bookkeeping

-- Create accounts table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    currency VARCHAR(3) DEFAULT 'USD',
    balance NUMERIC(19, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ledger_transactions table (double-entry ledger)
CREATE TABLE ledger_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id UUID UNIQUE,
    description VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted_at TIMESTAMP
);

-- Create ledger_entries table (double-entry lines)
CREATE TABLE ledger_entries (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES ledger_transactions(id),
    account_id INTEGER REFERENCES accounts(id),
    entry_type VARCHAR(10) CHECK (entry_type IN ('debit', 'credit')),
    amount NUMERIC(19, 2) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_ledger_transactions_status ON ledger_transactions(status);
CREATE INDEX idx_ledger_transactions_created ON ledger_transactions(created_at);
CREATE INDEX idx_ledger_entries_transaction ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_account ON ledger_entries(account_id);
CREATE INDEX idx_ledger_entries_type ON ledger_entries(entry_type);

-- Create accounts table update trigger
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.entry_type = 'debit' THEN
        NEW.balance = NEW.balance - NEW.amount;
    ELSE
        NEW.balance = NEW.balance + NEW.amount;
    END IF;
    RETURN NEW;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balance_trigger
AFTER INSERT ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION update_account_balance();