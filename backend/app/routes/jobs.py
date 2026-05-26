from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.db import SessionLocal
from app.models.job import JobApplication
from app.models.user import User
from app.schemas.job import JobCreate, JobResponse
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["Jobs"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/jobs", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_job = JobApplication(
        company=job.company,
        position=job.position,
        status=job.status,
        salary=job.salary,
        job_link=job.job_link,
        notes=job.notes,
        user_id=current_user.id
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/jobs")
def get_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    jobs = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id
    ).all()
    return jobs

@router.put("/jobs/{job_id}")
def update_job(
    job_id: int,
    updated_job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(JobApplication).filter(
        JobApplication.id == job_id,
        JobApplication.user_id == current_user.id
    ).first()
    if not job:
        return {"error": "Job not found"}
    job.company = updated_job.company
    job.position = updated_job.position
    job.status = updated_job.status
    job.salary = updated_job.salary
    job.job_link = updated_job.job_link
    job.notes = updated_job.notes
    db.commit()
    db.refresh(job)
    return job

@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(JobApplication).filter(
        JobApplication.id == job_id,
        JobApplication.user_id == current_user.id
    ).first()
    if not job:
        return {"error": "Job not found"}
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}