from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import patients, doctors, appointments, billing

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Hospital Management API"}
