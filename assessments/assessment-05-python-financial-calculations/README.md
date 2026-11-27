# Assessment 5: Python Financial Calculations

## Objective
Implement validated financial calculations with appropriate monetary precision, rounding, and boundary tests.

## Requirements
- Use decimal-safe monetary arithmetic and explicit rounding rules.
- Validate inputs and currency/amount boundaries.
- Cover required fee, interest, statement, and reconciliation calculations with tests.

The task brief is the available requirements source; no standalone handbook is present locally.

## Technologies and source
- Python 3, FastAPI, Pydantic (`analytics/requirements.txt`).
- Calculation and validation code: `analytics/src/calculations.py`.
- HTTP endpoints: `analytics/src/main.py`.
- Manual endpoint checks: `analytics/test_endpoints.py`.

## Existing calculation and validation behavior
- `calculate_interest` computes simple interest as `principal * rate * years / 100`, then rounds reported values to two decimal places. The implementation uses Python `float`, not `Decimal`.
- `InterestCalculation` requires principal greater than zero, a rate from zero through 100, and positive integer years; an additional validator rejects rates above 25.
- `TransactionValidation` requires an account ID, positive amount, and a three-letter currency format, then restricts currencies to USD, EUR, or GBP.
- `/calculate-interest` and `/validate-transaction` expose these operations. Pydantic request validation returns HTTP 422 for invalid model input; the transaction endpoint also raises 422 for unsupported currency.

## Setup and run
```powershell
cd analytics
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000
```

## Tests
With the service running in one terminal:
```powershell
cd analytics
python test_endpoints.py
```
The script makes live HTTP requests to port 8000. It checks health, valid and invalid interest input, and valid/invalid transaction currency. It is not a unit-test suite.

## Status and limitations
Simple-interest calculation and Pydantic validation are present. Decimal arithmetic, explicit financial rounding policy beyond `round(..., 2)`, fees, compound interest, statement/reconciliation calculations, isolated unit tests, and broader boundary coverage are absent. Test results are not asserted here unless the endpoint script has actually been run.
