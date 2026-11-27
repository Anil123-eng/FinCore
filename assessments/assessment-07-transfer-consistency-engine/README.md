# Assessment 7: Transfer Consistency Engine

## Objective
Make transfer posting safe and consistent under insufficient funds, retries, failures, and concurrent requests.

## Requirements
- Debit and credit postings must be atomic and balance-conserving.
- Validate source balance and reject invalid amounts/accounts.
- Enforce idempotency so a retry cannot create a second financial effect.
- Protect concurrent transfers and roll back all changes on failure.
- Apply safe, explicit transaction-state transitions.

The task brief is the available requirements source; no standalone handbook is present locally.

## Relevant implementation
- Transfer stub: `backend/src/app.ts`, `POST /api/transfers`.
- Intended ledger schema: `database/migrations/001_initial_schema.sql`.

## Setup and execution
```powershell
cd backend
npm install
npm run dev
```
The existing endpoint accepts JSON properties `from`, `to`, and `amount`. It returns a generated transfer ID and `completed` status; it does not persist or post a transfer. The schema migration must be applied separately to a configured PostgreSQL database, but the current backend does not connect to it.

## Tests and verification
No transfer consistency, idempotency, concurrency, rollback, or insufficient-funds test is present in the inspected project. `npm run build` only checks the backend TypeScript build and does not verify transfer semantics.

## Status and limitations
Atomicity, balance validation, idempotency keys, locking/serialization, rollback, and transaction lifecycle enforcement are not implemented or verified. The endpoint's success-shaped response is a stub and must not be interpreted as a completed financial transfer.
