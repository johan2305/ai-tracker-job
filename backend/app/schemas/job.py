from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    company: str
    position: str
    status: str = "Applied"
    salary: Optional[str] = None
    job_link: Optional[str] = None
    notes: Optional[str] = None


class JobUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    status: Optional[str] = None
    salary: Optional[str] = None
    job_link: Optional[str] = None
    notes: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    company: str
    position: str
    status: str
    salary: Optional[str] = None
    job_link: Optional[str] = None
    notes: Optional[str] = None
    user_id: int

    class Config:
        from_attributes = True
