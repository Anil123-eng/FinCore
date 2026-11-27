from fastapi import FastAPI, HTTPException
from src.calculations import calculate_interest, validate_transaction
from pydantic import BaseModel, Field
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="FinCore Analytics Service",
    version="1.0.0",
    description="Python analytics service for FinCore platform"
)


@app.get("/health", tags=["health"], summary="Health check endpoint")
async def health_check():
    """Return service health status."""
    return {
        "status": "ok",
        "service": "fincore-analytics",
        "version": "1.0.0"
    }


@app.post("/calculate-interest", tags=["calculations"], summary="Calculate simple interest")
async def calculate_interest_endpoint(
    calculation: InterestCalculation
):
    """
    Calculate simple interest using the formula: I = P * R * T / 100

    - **principal**: Principal amount (must be > 0)
    - **rate**: Interest rate percentage (0-100, recommended <= 25%)
    - **years**: Number of years (must be > 0)

    Returns the interest amount and total.
    """
    result = calculate_interest(
        principal=calculation.principal,
        rate=calculation.rate,
        years=calculation.years
    )
    return result


@app.post("/validate-transaction", tags=["validation"], summary="Validate transaction data")
async def validate_transaction_endpoint(
    transaction: TransactionValidation
):
    """
    Validate transaction data using Pydantic model.

    - **account_id**: Account identifier string
    - **amount**: Transaction amount (must be > 0)
    - **currency**: 3-letter currency code (USD, EUR, GBP)

    Returns validation result.
    """
    result = validate_transaction(transaction.model_dump())
    if result["valid"]:
        return {"valid": True, "data": result["validated"]}
    else:
        raise HTTPException(status_code=422, detail=result["error"])


# Payment Intent model and endpoint
class PaymentIntent(BaseModel):
    amount: Optional[float] = Field(default=0, ge=0, description="Payment amount")
    currency: Optional[str] = Field(default="USD", pattern="^[A-Z]{3}$", description="Currency code")


@app.post("/payment-intents", tags=["payment-intents"], summary="Create payment intent")
async def create_payment_intent(
    payment_intent: PaymentIntent
):
    """Create a payment intent for a simulated transaction."""
    return {
        "id": "PI-" + str(os.urandom(8).hex()),
        "amount": payment_intent.amount,
        "currency": payment_intent.currency,
        "status": "created"
    }


# Refund model and endpoint
class Refund(BaseModel):
    transfer_id: str
    amount: Optional[float] = Field(default=0, ge=0, description="Refund amount")


@app.post("/refunds", tags=["refunds"], summary="Create refund")
async def create_refund(refund: Refund):
    """Create a refund for a simulated transfer."""
    return {
        "id": "RFD-" + str(os.urandom(8).hex()),
        "transfer_id": refund.transfer_id,
        "amount": refund.amount,
        "status": "processed"
    }


# Reversal model and endpoint
class Reversal(BaseModel):
    transfer_id: str


@app.post("/reversals", tags=["reversals"], summary="Create reversal")
async def create_reversal(reversal: Reversal):
    """Create a reversal for a simulated transfer."""
    return {
        "id": "REV-" + str(os.urandom(8).hex()),
        "transfer_id": reversal.transfer_id,
        "status": "reversed"
    }


# Dispute model and endpoint (already have validate-transaction, add dispute-specific)
class DisputeCreate(BaseModel):
    transaction_id: str
    reason: str = Field(..., min_length=1, description="Reason for dispute")


@app.post("/disputes", tags=["disputes"], summary="Create dispute")
async def create_dispute(dispute: DisputeCreate):
    """Create a dispute for a simulated transaction."""
    return {
        "id": "DIS-" + str(os.urandom(8).hex()),
        "transaction_id": dispute.transaction_id,
        "reason": dispute.reason,
        "status": "under_review"
    }