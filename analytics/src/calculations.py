from pydantic import BaseModel, Field, field_validator
from typing import Optional


class InterestCalculation(BaseModel):
    """Pydantic model for simple interest calculation inputs."""
    principal: float = Field(..., gt=0, description="Principal amount")
    rate: float = Field(..., ge=0, le=100, description="Interest rate percentage")
    years: int = Field(..., gt=0, description="Number of years")

    @field_validator('rate')
    def rate_must_be_reasonable(cls, v):
        if v > 25:
            raise ValueError("Rate should not exceed 25%")
        return v


class TransactionValidation(BaseModel):
    """Pydantic model for transaction validation."""
    account_id: str
    amount: float = Field(..., gt=0, description="Transaction amount in currency units")
    currency: str = Field(default="USD", pattern="^[A-Z]{3}$")

    @field_validator('currency')
    def currency_must_be_valid(cls, v):
        valid_currencies = ["USD", "EUR", "GBP"]
        if v not in valid_currencies:
            raise ValueError(f"Unsupported currency. Must be one of: {', '.join(valid_currencies)}")
        return v


def calculate_interest(principal: float, rate: float, years: int) -> dict:
    """
    Calculate simple interest using the formula: I = P * R * T / 100

    Args:
        principal: Principal amount (P)
        rate: Interest rate percentage (R)
        years: Number of years (T)

    Returns:
        dict with principal, rate, years, interest, and total
    """
    interest = (principal * rate * years) / 100
    total = principal + interest
    return {
        "principal": round(principal, 2),
        "rate_percent": round(rate, 2),
        "years": years,
        "interest": round(interest, 2),
        "total": round(total, 2)
    }


def validate_transaction(transaction_data: dict) -> dict:
    """
    Validate transaction data using Pydantic model.

    Returns dict with 'valid' boolean and either validated data or error details.
    """
    try:
        validated = TransactionValidation(**transaction_data)
        return {"valid": True, "validated": validated.model_dump()}
    except Exception as e:
        return {"valid": False, "error": str(e)}