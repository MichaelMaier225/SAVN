"""
main.py

Entry point for ClearLedger.
Controls application flow and company sessions.

This file does NOT store data.
This file does NOT define data structures.
It coordinates user actions using the storage and models layers.
"""

from storage import (
    get_company_ids,
    create_company,
    add_transaction,
    get_transactions,
    update_transaction,
    delete_transaction,
    summarize_by_category
)
from models import create_transaction


# -------------------------
# Company selection flows
# -------------------------

def select_company():
    company_ids = get_company_ids()

    if not company_ids:
        print("No companies exist yet.\n")
        return None

    while True:
        print("\nAvailable companies:")
        for cid in company_ids:
            print(f"- {cid}")

        company_id = input("Select company ID: ").strip().lower()

        if company_id in company_ids:
            return company_id
        else:
            print("Invalid company. Try again.\n")


def create_company_flow():
    while True:
        company_id = input("New company ID: ").strip().lower()
        name = input("Company name: ").strip()

        if not company_id or not name:
            print("Company ID and name cannot be empty.\n")
            continue

        try:
            create_company(company_id, name)
            print("Company created successfully.\n")
            return company_id
        except ValueError:
            print("Company ID already exists. Try again.\n")


# -------------------------
# Transaction flows
# -------------------------

def add_transaction_flow(active_company):
    description = input("Description: ").strip()

    while True:
        try:
            amount = float(input("Amount: "))
            break
        except ValueError:
            print("Amount must be a number.\n")

    category = input("Category: ").strip()

    transaction = create_transaction(
        company_id=active_company,
        description=description,
        amount=amount,
        category=category
    )

    add_transaction(active_company, transaction)
    print("Transaction added.\n")


def view_transactions_flow(active_company):
    transactions = get_transactions(active_company)

    if not transactions:
        print("No transactions found.\n")
        return

    print(f"\nLedger for {active_company}:\n")

    for i, t in enumerate(transactions):
        print(
            f"[{i}] {t['date']} | {t['description']} | "
            f"${t['amount']} | {t['category']}"
        )
    print()


def edit_transaction_flow(active_company):
    transactions = get_transactions(active_company)

    if not transactions:
        print("No transactions to edit.\n")
        return

    view_transactions_flow(active_company)

    try:
        index = int(input("Enter transaction number to edit: "))
    except ValueError:
        print("Invalid input.\n")
        return

    field = input("Edit field (description, amount, category): ").strip().lower()

    if field not in ["description", "amount", "category"]:
        print("Invalid field.\n")
        return

    if field == "amount":
        try:
            value = float(input("New amount: "))
        except ValueError:
            print("Amount must be a number.\n")
            return
    else:
        value = input("New value: ").strip()

    try:
        update_transaction(active_company, index, {field: value})
        print("Transaction updated.\n")
    except IndexError:
        print("Invalid transaction number.\n")


def delete_transaction_flow(active_company):
    transactions = get_transactions(active_company)

    if not transactions:
        print("No transactions to delete.\n")
        return

    view_transactions_flow(active_company)

    try:
        index = int(input("Enter transaction number to delete: "))
    except ValueError:
        print("Invalid input.\n")
        return

    confirm = input("Are you sure? (y/n): ").strip().lower()

    if confirm != "y":
        print("Deletion cancelled.\n")
        return

    try:
        delete_transaction(active_company, index)
        print("Transaction deleted.\n")
    except IndexError:
        print("Invalid transaction number.\n")


def summary_flow(active_company):
    summary = summarize_by_category(active_company)

    if not summary:
        print("No data to summarize.\n")
        return

    print("\nCategory Summary:\n")
    for category, total in summary.items():
        print(f"{category}: ${total}")
    print()


# -------------------------
# Company session
# -------------------------

def company_session(active_company):
    while True:
        print(f"\nClearLedger — {active_company}")
        print("1. Add transaction")
        print("2. View transactions")
        print("3. Edit transaction")
        print("4. Delete transaction")
        print("5. Category summary")
        print("6. Switch company")
        print("7. Exit")

        choice = input("Select an option: ").strip()

        if choice == "1":
            add_transaction_flow(active_company)
        elif choice == "2":
            view_transactions_flow(active_company)
        elif choice == "3":
            edit_transaction_flow(active_company)
        elif choice == "4":
            delete_transaction_flow(active_company)
        elif choice == "5":
            summary_flow(active_company)
        elif choice == "6":
            return
        elif choice == "7":
            exit()
        else:
            print("Invalid option.\n")


# -------------------------
# App entry point
# -------------------------

def main():
    while True:
        print("\nClearLedger")
        print("1. Select company")
        print("2. Create company")
        print("3. Exit")

        choice = input("Select an option: ").strip()

        if choice == "1":
            company = select_company()
            if company:
                company_session(company)
        elif choice == "2":
            company = create_company_flow()
            company_session(company)
        elif choice == "3":
            print("Goodbye.")
            break
        else:
            print("Invalid option.\n")


if __name__ == "__main__":
    main()
