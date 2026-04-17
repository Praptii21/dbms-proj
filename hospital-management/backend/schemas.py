from pydantic import BaseModel
from typing import List, Optional

class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    status: Optional[str] = "Triage"
    ward: Optional[str] = "General"

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int

    class Config:
        from_attributes = True

class DoctorBase(BaseModel):
    name: str
    specialization: str
    experience: str
    status: str

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int

    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    date: str
    time: str
    doctor: str
    type: str
    status: str

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int

    class Config:
        from_attributes = True

class BillingBase(BaseModel):
    invoice_id: str
    date: str
    service: str
    amount: str
    status: str

class BillingCreate(BillingBase):
    pass

class Billing(BillingBase):
    id: int

    class Config:
        orm_mode = True
