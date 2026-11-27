# Assessment 3: Double-Entry Ledger Database

## Objective
Represent financial accounts and transactions in PostgreSQL with precise monetary values, valid references, balanced double-entry postings, and atomic transaction handling.

## Requirements
- Define accounts, ledger transactions, and debit/credit entries with database constraints.
- Preserve monetary precision and prevent unbalanced or invalid postings.
- Make posting atomic and protect ledger history from mutation.
- Provide repeatable migrations and verify behavior against PostgreSQL.

The task brief supplies the available requirements; a standalone handbook file is not present locally.

## Technologies and relevant files
- PostgreSQL SQL migration: `database/migrations/001_initial_schema.sql`
- Compose configuration: `infrastructure/docker/docker-compose.yml`
- No PostgreSQL client/ORM dependency is declared in `backend/package.json`.

## Current schema
The migration declares:
- `accounts`: serial primary key, name, account type check, currency, numeric balance, active flag, timestamps.
- `ledger_transactions`: serial primary key, unique nullable UUID, description, status check, creation and posting timestamps.
- `ledger_entries`: serial primary key, references to transaction and account, debit/credit type check, `NUMERIC(19,2)` amount, description, timestamp.
- Indexes on transaction status/creation time and entry transaction/account/type.
- A trigger intended to update an account balance when an entry is inserted.

## Migration instructions
Create a PostgreSQL database and apply the migration from the repository root:

```powershell
psql -U fincore -d fincore -f database/migrations/001_initial_schema.sql
psql -U fincore -d fincore -c "\dt"
```

These commands require a running PostgreSQL instance and suitable credentials. The Compose database service currently does not mount this migration into PostgreSQL's initialization directory.

## Tests and verification
No database integration test is present in the tracked project. `psql` was unavailable in the inspection environment, so the migration was not executed or verified against PostgreSQL.

## Status and limitations
The migration is an incomplete scaffold, not a verified ledger. In particular, its PL/pgSQL function body is missing the function-closing `END`, and it references `NEW.balance` on a `ledger_entries` row rather than updating the related account. There is no positive-amount constraint, no database-enforced equal debit/credit invariant, no demonstrated immutable-entry policy, and no application integration or concurrency test. Migration success and atomic ledger behavior must not be claimed.
