# Assessment 3: Double-Entry Ledger Database

## Overview
Implement the double-entry ledger database schema and migrations.

## Handbook Requirements
- Assessment 3 from FinCore Handbook Section 6
- Implement appropriate schemas, constraints, references, immutable ledger entries, transactions, monetary precision and migrations.

## Technology Stack
- PostgreSQL database
- PostgreSQL migrations using Drizzle ORM or Prisma
- Node.js/Express.js backend integration
- PostgreSQL query builder or ORM

## Implementation Details
- Accounts table with proper constraints
- Ledger transactions table with proper references
- Ledger entries table with debit/credit entries
- Trigger-based balance updates
- Atomic transaction handling
- UUID transaction IDs with constraint prevention
- NUMERIC(19,2) monetary amounts for precision
- Appropriate audit records and audit trails

## Important Files
- database/migrations/001_initial_schema.sql
- backend/src/app.ts (enhanced)
- infrastructure/docker/

## Running the Implementation
```bash
# Apply migrations
psql -U postgres -d fincore -f database/migrations/001_initial_schema.sql

# Start the backend
cd backend
npm run build
npm run dev

# Verify database tables
psql -U postgres -d fincore -c "\dt"
```

---\n\n",