# Assessment 2: Financial REST APIs

## Objective
Expose the FinCore customer, account, wallet, beneficiary, transfer, payment-intent, refund, reversal, dispute, and statement workflows through REST endpoints.

## Requirements
- Implement the financial resources and workflows using the API conventions requested by the handbook.
- Validate request bodies and return predictable success and error responses.
- Use the backend's required TypeScript/Node.js stack and connect persistence/authentication as required.
- Keep all transactions simulated.

No standalone handbook file is present in the repository; the requirements summary is based on the task brief.

## Technologies and setup
The current backend uses Node.js, Express, and TypeScript. It has no database driver or ORM dependency in `backend/package.json`.

```powershell
cd backend
npm install
npm run build
npm run dev
```

The service defaults to port `3001`. Set `PORT` in the environment to change it. `GET /api/health` is the health endpoint.

## Existing endpoints
All routes are defined in `backend/src/app.ts`.

| Method and path | Observed request/response behavior |
|---|---|
| `GET /api/health` | Returns `status`, timestamp, and service name. |
| `POST /api/customers` | Reads `name`, `email`, and `address`; returns a generated ID and those values. |
| `GET /api/accounts` | Returns one hard-coded simulated account. |
| `GET /api/wallets` | Returns two hard-coded simulated wallets. |
| `GET /api/beneficiaries` | Returns one hard-coded beneficiary. |
| `POST /api/transfers` | Reads `from`, `to`, and `amount`; returns a generated ID and `completed` status, but the response amount is the literal `"(simulated)"`. |
| `POST /api/payment-intents` | Reads `amount` and `currency`; returns a generated ID, default currency `USD`, and `created` status; amount is a placeholder string. |
| `POST /api/refunds` | Reads `transferId` and `amount`; returns a generated ID and `processed` status; amount is a placeholder string. |
| `POST /api/reversals` | Reads `transferId`; returns a generated ID and `reversed` status. |
| `POST /api/disputes` | Reads `transactionId` and `reason`; returns a generated ID and `under_review` status. |
| `GET /api/statements` | Returns a fixed period and one sample transaction. |

Unknown routes return JSON `404`; the error middleware returns JSON `500`. The examples above are not a formal API contract.

## Example requests
```powershell
curl.exe http://localhost:3001/api/health
curl.exe -X POST http://localhost:3001/api/customers -H "Content-Type: application/json" -d "{\"name\":\"Sample\",\"email\":\"sample@example.test\",\"address\":\"Example\"}"
```

## Tests and verification
```powershell
cd backend
npm run build
```
No backend API test script or request-schema/contract test suite is declared in the inspected package. Use the example requests for manual smoke checks only.

## Status and limitations
Route stubs exist, but they use in-memory/static placeholder responses. Request validation, authentication middleware, database persistence, durable IDs, and real ledger-backed balances are not implemented. Refund, reversal, and transfer success statuses do not prove financial processing.
