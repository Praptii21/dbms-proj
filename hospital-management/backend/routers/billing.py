from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal, engine

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_billing(db: Session):
    if db.query(models.Billing).count() == 0:
        invoices = [
            {"invoice_id": "INV-29001", "date": "Sep 14, 2024", "service": "General Consultation", "amount": "₹1200.00", "status": "Paid"},
            {"invoice_id": "INV-29084", "date": "Oct 02, 2024", "service": "Blood Work Panel", "amount": "₹15200.00", "status": "Pending"}
        ]
        for inv in invoices:
            db_inv = models.Billing(**inv)
            db.add(db_inv)
        db.commit()

@router.get("/", response_model=List[schemas.Billing])
def read_billing(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    seed_billing(db)
    billing = db.query(models.Billing).offset(skip).limit(limit).all()
    return billing

@router.post("/", response_model=schemas.Billing)
def create_billing(billing: schemas.BillingCreate, db: Session = Depends(get_db)):
    db_billing = models.Billing(**billing.dict())
    db.add(db_billing)
    db.commit()
    db.refresh(db_billing)
    return db_billing

@router.put("/{billing_id}", response_model=schemas.Billing)
def update_billing(billing_id: int, billing: schemas.BillingCreate, db: Session = Depends(get_db)):
    db_billing = db.query(models.Billing).filter(models.Billing.id == billing_id).first()
    if not db_billing:
        raise HTTPException(status_code=404, detail="Invoice not found")
    for var, value in vars(billing).items():
        setattr(db_billing, var, value) if value else None
    db.commit()
    db.refresh(db_billing)
    return db_billing

@router.get("/balance")
def get_balance(db: Session = Depends(get_db)):
    seed_billing(db)
    invoices = db.query(models.Billing).filter(models.Billing.status != "Paid").all()
    total_balance = sum(float(inv.amount.replace('₹', '').replace(',', '')) for inv in invoices)
    return {"balance": total_balance}
