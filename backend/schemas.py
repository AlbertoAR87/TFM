from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str = ""
    company: str = ""

class UserUpdate(BaseModel):
    full_name: str
    company: str

class User(BaseModel):
    id: int
    email: str
    full_name: str
    company: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None

class SalesData(BaseModel):
    Temperature: float
    Customers: float
    Marketing_Spend: float
    Month: int
    DayOfWeek: int
    Region_East: int
    Region_North: int
    Region_South: int
    Promotion_Yes: int
    Holiday_Yes: int

class SalesPredictionResponse(BaseModel):
    prediction: float
    accuracy_percentage: float

class MaintenanceData(BaseModel):
    Sensor1: float
    Sensor2: float
    Sensor3: float
    Temperature: float
    Pressure: float
    Vibration: float

class ChatPrompt(BaseModel):
    prompt: str