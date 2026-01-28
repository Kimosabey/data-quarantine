from pydantic import BaseModel, ValidationError, EmailStr

class UserEvent(BaseModel):
    user_id: str
    email: EmailStr
    action: str
    timestamp: float

def validate_message(data: dict) -> tuple[bool, str | None]:
    try:
        # Enforce Schema
        UserEvent(**data)
        return True, None
    except ValidationError as e:
        return False, e.json()
