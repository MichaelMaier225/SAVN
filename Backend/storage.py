"""
storage.py

This file handles saving and loading data.
It is the only file allowed to touch the data files.

Its responsibilities:
- Persist company data
- Isolate company ledgers
- Provide safe CRUD operations on transactions

Nothing else should care how data is stored.
"""

import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "Data" / "companies.json"



# Core persistence helpers


def load_companies():
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_companies(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)



# Company operations


def get_company_ids():
    data = load_companies()
    return list(data["companies"].keys())


def create_company(company_id, name):
    data = load_companies()

    if company_id in data["companies"]:
        raise ValueError("Company already exists")

    data["companies"][company_id] = {
        "name": name,
        "transactions": []
    }

    save_companies(data)



# Transaction operations


def add_transaction(company_id, transaction):
    data = load_companies()

    if company_id not in data["companies"]:
        raise ValueError("Company does not exist")

    data["companies"][company_id]["transactions"].append(transaction)
    save_companies(data)


def get_transactions(company_id):
    data = load_companies()

    if company_id not in data["companies"]:
        raise ValueError("Company does not exist")

    return data["companies"][company_id]["transactions"]


def update_transaction(company_id, index, updated_fields):
    data = load_companies()

    if company_id not in data["companies"]:
        raise ValueError("Company does not exist")

    transactions = data["companies"][company_id]["transactions"]

    if index < 0 or index >= len(transactions):
        raise IndexError("Invalid transaction index")

    transactions[index].update(updated_fields)
    save_companies(data)


def delete_transaction(company_id, index):
    data = load_companies()

    if company_id not in data["companies"]:
        raise ValueError("Company does not exist")

    transactions = data["companies"][company_id]["transactions"]

    if index < 0 or index >= len(transactions):
        raise IndexError("Invalid transaction index")

    transactions.pop(index)
    save_companies(data)



# Reporting


def summarize_by_category(company_id):
    transactions = get_transactions(company_id)
    summary = {}

    for t in transactions:
        category = t["category"]
        summary[category] = summary.get(category, 0) + t["amount"]

    return summary
