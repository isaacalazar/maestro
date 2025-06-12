from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from app.db.supabase import supabase
from app.models.job import Job, JobCreate, JobUpdate
from app.services.email_parser import parse_and_classify_emails
from app.services.performance_monitor import performance_monitor, monitor_performance
from google.oauth2.credentials import Credentials
import traceback
import os

router = APIRouter()

# Helper function to get current user (placeholder for authentication)
async def get_current_user():
    # TODO: Implement proper authentication
    # For now, get the first user from the database (or most recent)
    try:
        users_response = supabase.table("users").select("id, email").order("created_at", desc=True).limit(1).execute()
        if users_response.data:
            user = users_response.data[0]
            print(f"Using user: {user['email']} (ID: {user['id']})")
            return user['id']
        else:
            print("No users found in database - you need to complete OAuth first")
            # Return a valid UUID format as fallback
            return "550e8400-e29b-41d4-a716-446655440000"
    except Exception as e:
        print(f"Error fetching user: {e}")
        # Return a valid UUID format as fallback
        return "550e8400-e29b-41d4-a716-446655440000"

@router.get("/jobs", response_model=List[Job])
async def get_jobs(user_id: str = Depends(get_current_user)):
    """Get all job applications for the user"""
    try:
        print(f"Fetching jobs for user: {user_id}")
        print(f"Supabase client: {supabase}")
        
        response = supabase.table("jobs").select("*").eq("user_id", user_id).execute()
        print(f"Supabase response: {response}")
        
        return response.data if response.data else []
    except Exception as e:
        print(f"Error in get_jobs: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/jobs", response_model=Job)
async def create_job(job: JobCreate, user_id: str = Depends(get_current_user)):
    """Create a job record manually"""
    try:
        print(f"Creating job for user: {user_id}")
        print(f"Job data: {job}")
        
        job_data = job.dict()
        job_data["user_id"] = user_id
        
        # Set applied_date to now if not provided
        if not job_data.get("applied_date"):
            job_data["applied_date"] = datetime.now().isoformat()
        else:
            job_data["applied_date"] = job_data["applied_date"].isoformat()
        
        print(f"Final job data: {job_data}")
        
        response = supabase.table("jobs").insert(job_data).execute()
        print(f"Insert response: {response}")
        
        return response.data[0]
    except Exception as e:
        print(f"Error in create_job: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/sync-emails")
@monitor_performance("sync_emails_endpoint")
async def sync_emails(user_id: str = Depends(get_current_user)):
    """Manually trigger email parsing and sync with performance monitoring"""
    try:
        print(f"🚀 HIGH-PERFORMANCE email sync requested for user: {user_id}")
        
        # Get user's credentials from database
        user_response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_response.data[0]
        
        if not user_data.get('access_token'):
            raise HTTPException(status_code=400, detail="User has not connected Google account")
        
        # Create credentials object
        credentials = Credentials(
            token=user_data['access_token'],
            refresh_token=user_data.get('refresh_token'),
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        # Parse and classify emails with performance monitoring
        processed_jobs = await parse_and_classify_emails(credentials, user_id)
        
        # Print performance report
        performance_monitor.print_performance_report()
        
        return {
            "message": f"High-performance email sync completed successfully",
            "jobs_processed": len(processed_jobs),
            "jobs": processed_jobs,
            "performance_report": performance_monitor.get_performance_report()
        }
        
    except Exception as e:
        print(f"Error in sync_emails: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Email sync error: {str(e)}") 