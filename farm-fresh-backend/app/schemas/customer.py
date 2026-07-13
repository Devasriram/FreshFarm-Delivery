from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class CustomerRegister(BaseModel):
    full_name: str
    mobile_number: str
    email: EmailStr
    village: str
    password: str


class CustomerLogin(BaseModel):
    mobile_number: str
    password: str


class CustomerResponse(BaseModel):
    customer_id: str
    full_name: str
    mobile_number: str
    email: EmailStr
    village: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginResponse(Token):
    customer: CustomerResponse