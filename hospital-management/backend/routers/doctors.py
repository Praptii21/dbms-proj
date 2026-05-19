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

def seed_doctors():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM doctors")
    count = cursor.fetchone()[0]
    
    if count == 0:
        directory = [
            ("Dr. Sarah Jenkins", "Cardiology", "15 Years", "Available"),
            ("Dr. Marcus Webb", "Neurology", "11 Years", "Booked"),
            ("Dr. Alyssa Chen", "Pediatrics", "8 Years", "Available"),
            ("Dr. Robert Frost", "Orthopedics", "22 Years", "Available"),
            ("Dr. Emily Carter", "Dermatology", "12 Years", "Booked"),
            ("Dr. James Mitchell", "General Surgery", "19 Years", "Available"),
            ("Dr. Priya Sharma", "Oncology", "14 Years", "Booked"),
            ("Dr. David Kim", "Psychiatry", "9 Years", "Available")
        ]
        cursor.executemany(
            "INSERT INTO doctors (name, specialization, experience, status) VALUES (?, ?, ?, ?)",
            directory
        )
        conn.commit()
    conn.close()

@router.get("/", response_model=List[schemas.Doctor])
def read_doctors(skip: int = 0, limit: int = 100):
    seed_doctors()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM doctors LIMIT ? OFFSET ?", (limit, skip))
    doctors = cursor.fetchall()
    
    conn.close()
    return [dict(row) for row in doctors]

@router.post("/", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO doctors (name, specialization, experience, status) VALUES (?, ?, ?, ?)",
        (doctor.name, doctor.specialization, doctor.experience, doctor.status)
    )
    
    doc_id = cursor.lastrowid
    conn.commit()
    
    cursor.execute("SELECT * FROM doctors WHERE id = ?", (doc_id,))
    new_doc = cursor.fetchone()
    
    conn.close()
    return dict(new_doc)

@router.put("/{doctor_id}", response_model=schemas.Doctor)
def update_doctor_status(doctor_id: int, status: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM doctors WHERE id = ?", (doctor_id,))
    doc = cursor.fetchone()
    
    if not doc:
        conn.close()
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    cursor.execute("UPDATE doctors SET status = ? WHERE id = ?", (status, doctor_id))
    conn.commit()
    
    cursor.execute("SELECT * FROM doctors WHERE id = ?", (doctor_id,))
    updated_doc = cursor.fetchone()
    
    conn.close()
    return dict(updated_doc)
