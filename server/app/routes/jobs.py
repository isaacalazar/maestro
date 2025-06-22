from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from datetime import datetime
from app.db.supabase import supabase
from app.models.job import Job, JobCreate, JobUpdate
from app.services.email_parser import parse_and_classify_emails
from google.oauth2.credentials import Credentials
import traceback
import os

router = APIRouter()

async def get_current_user(request: Request):
    """Get the current user based on email from query parameters"""
    try:
        user_email = request.query_params.get('user_email')
        
        if not user_email:
            raise HTTPException(status_code=401, detail="User email is required")
        
        # Find user by email in Supabase
        users_response = supabase.table("users").select("id, email").eq("email", user_email).execute()
        
        if not users_response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = users_response.data[0]
        print(f"Authenticated user: {user['email']} (ID: {user['id']})")
        return user['id']
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_current_user: {e}")
        raise HTTPException(status_code=500, detail="Authentication error")

@router.get("/jobs", response_model=List[Job])
async def get_jobs(request: Request, user_id: str = Depends(get_current_user)):
    """Get all job applications for the authenticated user"""
    try:
        print(f"Fetching jobs for user: {user_id}")
        
        response = supabase.table("jobs").select("*").eq("user_id", user_id).execute()
        print(f"Found {len(response.data) if response.data else 0} jobs for user")
        
        return response.data if response.data else []
    except Exception as e:
        print(f"Error in get_jobs: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/jobs", response_model=Job)
async def create_job(job: JobCreate, request: Request, user_id: str = Depends(get_current_user)):
    """Create a job record for the authenticated user"""
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
async def sync_emails(request: Request, user_id: str = Depends(get_current_user)):
    """Manually trigger email parsing and sync for the authenticated user"""
    try:
        print(f"Manual email sync requested for user: {user_id}")
        
        # Get user's credentials from database
        user_response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_response.data[0]
        
        if not user_data.get('access_token'):
            raise HTTPException(status_code=400, detail="User has not connected Google account")
        
        # Debug: Check what credentials data we have
        print(f"User credentials data:")
        print(f"  - access_token: {'***' if user_data.get('access_token') else 'MISSING'}")
        print(f"  - refresh_token: {'***' if user_data.get('refresh_token') else 'MISSING'}")
        print(f"  - token_expiry: {user_data.get('token_expiry')}")
        
        # Check if refresh token is missing
        if not user_data.get('refresh_token'):
            raise HTTPException(
                status_code=400, 
                detail="Refresh token missing. Please reconnect your Google account by clicking 'Connect Google' again."
            )
        
        # Create credentials object with all required fields
        credentials = Credentials(
            token=user_data['access_token'],
            refresh_token=user_data['refresh_token'],
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        print(f"Created credentials object with:")
        print(f"  - token: {'***' if credentials.token else 'MISSING'}")
        print(f"  - refresh_token: {'***' if credentials.refresh_token else 'MISSING'}")
        print(f"  - token_uri: {credentials.token_uri}")
        print(f"  - client_id: {credentials.client_id}")
        print(f"  - client_secret: {'***' if credentials.client_secret else 'MISSING'}")
        
        # Parse and classify emails
        processed_jobs = await parse_and_classify_emails(credentials, user_id)
        
        return {
            "message": f"Email sync completed successfully",
            "jobs_processed": len(processed_jobs),
            "jobs": processed_jobs
        }
        
    except Exception as e:
        print(f"Error in sync_emails: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Email sync error: {str(e)}") 