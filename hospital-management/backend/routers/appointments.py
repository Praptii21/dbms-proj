from fastapi import APIRouter, HTTPException
import sqlite3
from typing import List
import schemas
import os
import random

router = APIRouter()

# Path to database
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "hospital.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@router.get("/", response_model=List[schemas.Appointment])
def read_appointments(skip: int = 0, limit: int = 100):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM appointments LIMIT ? OFFSET ?", (limit, skip))
    appointments = cursor.fetchall()
    
    conn.close()
    return [dict(row) for row in appointments]

@router.post("/", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Create the appointment
        cursor.execute(
            "INSERT INTO appointments (date, time, doctor, type, status) VALUES (?, ?, ?, ?, ?)",
            (appointment.date, appointment.time, appointment.doctor, appointment.type, appointment.status or "Active")
        )
        appointment_id = cursor.lastrowid
        
        # 2. Automatically create a billing entry (Automated DBMS logic)
        invoice_id = f"INV-{random.randint(10000, 99999)}"
        cursor.execute(
            "INSERT INTO billing (invoice_id, date, service, amount, status) VALUES (?, ?, ?, ?, ?)",
            (invoice_id, appointment.date, f"Consultation: {appointment.type}", "₹500.00", "Pending")
        )
        
        conn.commit()
        
        cursor.execute("SELECT * FROM appointments WHERE id = ?", (appointment_id,))
        new_appointment = cursor.fetchone()
        
        conn.close()
        return dict(new_appointment)
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{appointment_id}", response_model=schemas.Appointment)
def update_appointment(appointment_id: int, appointment: schemas.AppointmentCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM appointments WHERE id = ?", (appointment_id,))
    apt = cursor.fetchone()
    
    if not apt:
        conn.close()
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    cursor.execute(
        "UPDATE appointments SET date = ?, time = ?, doctor = ?, type = ?, status = ? WHERE id = ?",
        (appointment.date, appointment.time, appointment.doctor, appointment.type, appointment.status, appointment_id)
    )
    conn.commit()
    
    cursor.execute("SELECT * FROM appointments WHERE id = ?", (appointment_id,))
    updated_appointment = cursor.fetchone()
    
    conn.close()
    return dict(updated_appointment)

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM appointments WHERE id = ?", (appointment_id,))
    apt = cursor.fetchone()
    
    if not apt:
        conn.close()
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    cursor.execute("DELETE FROM appointments WHERE id = ?", (appointment_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Appointment deleted successfully"}
