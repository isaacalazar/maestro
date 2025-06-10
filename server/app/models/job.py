from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    REJECTED = "rejected"
    INTERVIEWING = "interviewing"
    OFFERED = "offered"

class Job(BaseModel):
    id: Optional[str] = None
    user_id: str
    company: str
    position: str
    status: ApplicationStatus = ApplicationStatus.APPLIED
    applied_date: datetime

class JobCreate(BaseModel):
    company: str
    position: str
    status: ApplicationStatus = ApplicationStatus.APPLIED
    applied_date: Optional[datetime] = None

class JobUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    applied_date: Optional[datetime] = None
