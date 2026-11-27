# Assessment 1: Financial Customer Frontend

## Objective
Provide a customer-facing FinCore interface for reviewing wallets and transactions and accessing beneficiary, transfer, dispute, statement, and operations views. The frontend is a simulation and must not handle real funds or banking credentials.

## Requirements
- Use a modern React frontend with Next.js App Router and TypeScript.
- Provide responsive customer screens and connect them to the financial API.
- Include useful loading, empty, and error states and validate user-entered forms.
- Use only synthetic financial data.

The repository does not contain a standalone handbook. This summary follows the assessment scope in the task brief; exact handbook rubric details cannot be verified locally.

## Technologies
- Next.js, React, TypeScript, Tailwind CSS (as configured by the frontend project).
- FinCore Express API, available separately on port 3001.

## Setup and run
In one terminal:

```powershell
cd frontend
npm ci
npm run dev
```

In another terminal, to start the available API:

```powershell
cd backend
npm install
npm run dev
```

The frontend development server defaults to `http://localhost:3000`; the API listens on `http://localhost:3001`.

## Relevant files
- `frontend/src/app/page.tsx` and `frontend/src/app/layout.tsx`
- `frontend/src/app/globals.css`
- `frontend/src/app/{beneficiaries,disputes,operations,statements,transactions,transfers}/`
- `frontend/src/app/wallets/`
- `frontend/package.json`
- `backend/src/app.ts` (available API routes)

## API connection
The API currently exposes routes under `/api` (see Assessment 2). A search of the frontend source found no `fetch`, Axios, API URL, or `/api/` references. The required live backend connection is therefore not implemented in the inspected frontend.

## Tests and verification
```powershell
cd frontend
npm run lint
npm run build
```
These are the scripts declared in `frontend/package.json`; no frontend-specific test script is declared. Results are not reported as passing until those commands have been run.

## Status and limitations
The frontend project and customer/operations route folders exist. The tracker records placeholder data and missing authentication and real balance calculations. API integration, real customer authentication, and verified form/loading/error behavior remain incomplete. No real-money integration is present or appropriate for this simulation.
