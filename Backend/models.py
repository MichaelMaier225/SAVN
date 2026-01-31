"""
models.py

This file defines the structure of our data.
It answers the question:
"What does a transaction look like?"

It does NOT save data.
It does NOT load data.
It only creates and describes data objects in a consistent format.

If we ever change how a transaction looks, we change it here.
"""

from datetime import date
import uuid


def create_transaction(company_id, description, amount, category):
    return {
        "transaction_id": str(uuid.uuid4()),
        "company_id": company_id,
        "date": date.today().isoformat(),
        "description": description,
        "amount": amount,
        "category": category
    }
