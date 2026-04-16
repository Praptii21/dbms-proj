from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_patients():
    return [{"id": 1, "name": "John Doe", "age": 30, "gender": "Male"}]
