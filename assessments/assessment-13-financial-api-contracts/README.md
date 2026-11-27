# Assessment 13: Financial API Contracts

## Objective
Specify and verify stable financial API request/response schemas, lifecycle semantics, and error behavior.

## Requirements
- Define contracts for financial resources and their transaction states.
- Specify validation, idempotency, error responses, pagination, statement exports, webhook verification, and test-mode behavior as required.
- Verify implementations against the published contracts.
- Assessment 13 implementation is reserved for later manual work.

No standalone handbook is present locally; this summary follows the task brief.

## Existing APIs and schema support
- Express routes are implemented as inline handlers in `backend/src/app.ts`; no OpenAPI document or request/response schema library is declared in `backend/package.json`.
- FastAPI uses Pydantic request models for interest and transaction validation in `analytics/src/main.py` and `analytics/src/calculations.py`. FastAPI provides generated OpenAPI/Swagger documentation at `/openapi.json` and `/docs` while running.
- Backend placeholder routes are listed in Assessment 2.

## Setup and verification
Start the Express or FastAPI service using Assessments 2 or 6. Inspect `http://localhost:8000/docs` for the analytics service's generated schema. No contract-diff, schema compatibility, or consumer contract test command is configured.

## Status and limitations
The FastAPI subset has generated documentation, but its API is not the complete financial contract. Express endpoints have no formal contract definitions, comprehensive validation, standardized error schema, idempotency contract, pagination, statement export, or webhook signature behavior. API compatibility is not verified.
