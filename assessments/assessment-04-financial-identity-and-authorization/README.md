# Assessment 4: Financial Identity and Authorization

## Objective
Authenticate FinCore users and enforce role- and resource-level permissions on sensitive financial operations.

## Requirements
- Define identity and authentication flows, secure credential handling, and session/token lifecycle including expiry and revocation where required.
- Enforce least-privilege roles and resource-level authorization on the server.
- Protect sensitive actions with appropriate confirmation and record security-relevant audit events.
- Never store or use real banking credentials in this educational simulation.

The task brief is the available requirements source; no standalone handbook is present locally.

## Technologies and relevant files
- Backend: Node.js, Express, TypeScript (`backend/src/app.ts`).
- Assessment-specific material: `assessment4/README.md`, `assessment4/test_assessment4.py`.
- Environment templates: `backend/.env.example`, `infrastructure/docker/.env.example`.

The existing backend does not declare authentication libraries in `backend/package.json`.

## Setup and verification
Start the backend with `cd backend; npm install; npm run dev`, then inspect its routes. The repository has an assessment check script:

```powershell
python -m pytest assessment4/test_assessment4.py
```

This command has not been run as part of this documentation task. The script's assertions check file presence and middleware keywords; they do not prove authentication or authorization behavior.

## Status and limitations
The inspected `backend/src/app.ts` contains no login, registration, token/session, password hashing, authorization middleware, roles, permissions, MFA, or audit trail. The assessment README under `assessment4/` describes security features that are not present in the inspected backend, so those statements are not treated as implementation evidence. Authentication, authorization, security tests, and verified secure credential configuration remain incomplete.
