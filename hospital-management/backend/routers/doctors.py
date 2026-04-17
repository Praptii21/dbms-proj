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

def seed_doctors(db: Session):
    if db.query(models.Doctor).count() == 0:
        directory = [
            {"name": "Dr. Sarah Jenkins", "specialization": "Cardiology", "experience": "15 Years", "status": "Available"},
            {"name": "Dr. Marcus Webb", "specialization": "Neurology", "experience": "11 Years", "status": "Booked"},
            {"name": "Dr. Alyssa Chen", "specialization": "Pediatrics", "experience": "8 Years", "status": "Available"},
            {"name": "Dr. Robert Frost", "specialization": "Orthopedics", "experience": "22 Years", "status": "Available"},
            {"name": "Dr. Emily Carter", "specialization": "Dermatology", "experience": "12 Years", "status": "Booked"},
            {"name": "Dr. James Mitchell", "specialization": "General Surgery", "experience": "19 Years", "status": "Available"},
            {"name": "Dr. Priya Sharma", "specialization": "Oncology", "experience": "14 Years", "status": "Booked"},
            {"name": "Dr. David Kim", "specialization": "Psychiatry", "experience": "9 Years", "status": "Available"}
        ]
        for doc in directory:
            db_doc = models.Doctor(**doc)
            db.add(db_doc)
        db.commit()

@router.get("/", response_model=List[schemas.Doctor])
def read_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    seed_doctors(db)
    doctors = db.query(models.Doctor).offset(skip).limit(limit).all()
    return doctors

@router.post("/", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    db_doctor = models.Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.put("/{doctor_id}", response_model=schemas.Doctor)
def update_doctor_status(doctor_id: int, status: str, db: Session = Depends(get_db)):
    db_doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db_doctor.status = status
    db.commit()
    db.refresh(db_doctor)
    return db_doctor
