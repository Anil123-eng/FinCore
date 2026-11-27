# Assessment 6: FastAPI Risk Analytics

## Objective
Provide a FastAPI analytics service that validates financial inputs and identifies risky transaction patterns for operations review.

## Requirements
- Implement the handbook's risk-analysis endpoints and validated request/response models.
- Support the required velocity/pattern analysis and risk flags using synthetic data.
- Make the service runnable independently and test invalid as well as valid inputs.

The task brief is the available requirements source; no standalone handbook is present locally.

## Technologies and source files
- Python, FastAPI, Pydantic, Uvicorn.
- `analytics/src/main.py`
- `analytics/src/calculations.py`
- `analytics/requirements.txt`
- `analytics/.env.example` (documents host and port variables)

## Existing endpoints and run instructions
The current application exposes `GET /health`, `POST /calculate-interest`, `POST /validate-transaction`, `POST /payment-intents`, `POST /refunds`, `POST /reversals`, and `POST /disputes`. It does not expose a risk-scoring, velocity-analysis, or suspicious-pattern endpoint.

```powershell
cd analytics
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000
```

FastAPI's generated API documentation is available at `http://localhost:8000/docs` while the service is running.

## Tests and verification
Run the existing HTTP smoke script against the running service:
```powershell
cd analytics
python test_endpoints.py
```
It covers the health, interest, and transaction-validation endpoints, not risk analytics.

## Status and limitations
The Python API and Pydantic models are present, but the requested risk analytics behavior and endpoint(s) are missing. Current payment-related handlers return simulated placeholder records. No risk dataset, risk-specific tests, persistence, or operational reporting is implemented.
