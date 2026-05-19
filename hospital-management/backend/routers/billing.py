from fastapi import APIRouter, HTTPException
import sqlite3
from typing import List
import schemas
import os

router = APIRouter()

# Path to database
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "hospital.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def seed_billing():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM billing")
    count = cursor.fetchone()[0]
    
    if count == 0:
        invoices = [
            ("INV-29001", "Sep 14, 2024", "General Consultation", "₹1200.00", "Paid"),
            ("INV-29084", "Oct 02, 2024", "Blood Work Panel", "₹15200.00", "Pending")
        ]
        cursor.executemany(
            "INSERT INTO billing (invoice_id, date, service, amount, status) VALUES (?, ?, ?, ?, ?)",
            invoices
        )
        conn.commit()
    conn.close()

@router.get("/", response_model=List[schemas.Billing])
def read_billing(skip: int = 0, limit: int = 100):
    seed_billing()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM billing LIMIT ? OFFSET ?", (limit, skip))
    billing = cursor.fetchall()
    
    conn.close()
    return [dict(row) for row in billing]

@router.post("/", response_model=schemas.Billing)
def create_billing(billing: schemas.BillingCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO billing (invoice_id, date, service, amount, status) VALUES (?, ?, ?, ?, ?)",
        (billing.invoice_id, billing.date, billing.service, billing.amount, billing.status)
    )
    
    billing_id = cursor.lastrowid
    conn.commit()
    
    cursor.execute("SELECT * FROM billing WHERE id = ?", (billing_id,))
    new_billing = cursor.fetchone()
    
    conn.close()
    return dict(new_billing)

@router.put("/{billing_id}", response_model=schemas.Billing)
def update_billing(billing_id: int, billing: schemas.BillingCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM billing WHERE id = ?", (billing_id,))
    inv = cursor.fetchone()
    
    if not inv:
        conn.close()
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    cursor.execute(
        "UPDATE billing SET invoice_id = ?, date = ?, service = ?, amount = ?, status = ? WHERE id = ?",
        (billing.invoice_id, billing.date, billing.service, billing.amount, billing.status, billing_id)
    )
    conn.commit()
    
    cursor.execute("SELECT * FROM billing WHERE id = ?", (billing_id,))
    updated_billing = cursor.fetchone()
    
    conn.close()
    return dict(updated_billing)

@router.get("/balance")
def get_balance():
    seed_billing()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT amount FROM billing WHERE status != 'Paid'")
    invoices = cursor.fetchall()
    
    total_balance = 0
    for inv in invoices:
        amount_str = inv['amount'].replace('₹', '').replace(',', '')
        try:
            total_balance += float(amount_str)
        except ValueError:
            continue
            
    conn.close()
    return {"balance": total_balance}
