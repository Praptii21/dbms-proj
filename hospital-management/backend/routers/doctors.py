from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_doctors():
    return [{"id": 1, "name": "Dr. Smith", "specialization": "Cardiology"}]
