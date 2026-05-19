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

@router.get("/", response_model=List[schemas.Patient])
def read_patients(skip: int = 0, limit: int = 100):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM patients LIMIT ? OFFSET ?"
    cursor.execute(query, (limit, skip))
    patients = cursor.fetchall()
    
    conn.close()
    return [dict(row) for row in patients]

@router.post("/", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "INSERT INTO patients (name, age, gender, status, ward) VALUES (?, ?, ?, ?, ?)"
    cursor.execute(query, (patient.name, patient.age, patient.gender, patient.status, patient.ward))
    
    patient_id = cursor.lastrowid
    conn.commit()
    
    # Fetch the newly created patient
    cursor.execute("SELECT * FROM patients WHERE id = ?", (patient_id,))
    new_patient = cursor.fetchone()
    
    conn.close()
    return dict(new_patient)

@router.delete("/{patient_id}")
def delete_patient(patient_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if exists
    cursor.execute("SELECT * FROM patients WHERE id = ?", (patient_id,))
    patient = cursor.fetchone()
    
    if not patient:
        conn.close()
        raise HTTPException(status_code=404, detail="Patient not found")
        
    cursor.execute("DELETE FROM patients WHERE id = ?", (patient_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Patient deleted successfully"}
