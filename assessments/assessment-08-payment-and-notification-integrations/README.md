# Assessment 8: Payment and Notification Integrations

## Objective
Model external payment and customer-notification workflows safely using provider test modes or controlled simulations.

## Requirements
- Document and implement the requested payment, refund, reversal, notification, and reconciliation workflows.
- Protect webhook authenticity and make event handling replay-safe.
- Use sandbox/simulated services unless the assessment explicitly authorizes a test provider.
- Do not use real funds or real customer credentials.

The task brief is the available requirements source; no standalone handbook is present locally.

## Existing implementation and files
- Express stubs: `backend/src/app.ts` (`/api/payment-intents`, `/api/refunds`, `/api/reversals`, `/api/disputes`).
- Python stubs: `analytics/src/main.py` (`/payment-intents`, `/refunds`, `/reversals`, `/disputes`).
- No payment provider SDK, email/SMS client, webhook receiver, or provider reconciliation module is declared in the inspected project.

## Run and inspect
Start either service using the relevant instructions in Assessments 2 and 6. The current handlers accept basic JSON fields and immediately return simulated IDs/statuses. They do not communicate with a provider or dispatch notifications.

## Tests and verification
No integration, webhook signature, duplicate-event, notification, or reconciliation tests are present. The analytics endpoint smoke script does not cover the payment endpoints.

## Status and limitations
Only response-shaped simulation stubs exist. Provider test-mode integration, notifications, signed webhooks, event deduplication, and settlement reconciliation are incomplete. Returned `processed` or `reversed` statuses are placeholders, not evidence of provider activity.
