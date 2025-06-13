from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
from app.db.supabase import supabase
from app.services.email_parser import parse_and_classify_emails

router = APIRouter()

# Google OAuth2 configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI", "http://localhost:8000/auth/callback")

SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.readonly'
]

@router.get("/google-login")
async def google_login():
    """Initiate Google OAuth2 login"""
    try:
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [REDIRECT_URI]
                }
            },
            scopes=SCOPES
        )
        flow.redirect_uri = REDIRECT_URI
        
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        return {"authorization_url": authorization_url, "state": state}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/callback")
async def google_callback(request: Request):
    """Handle Google OAuth2 callback"""
    try:
        # Get the authorization code from query parameters
        code = request.query_params.get('code')
        if not code:
            raise HTTPException(status_code=400, detail="Authorization code not found")
        
        # Exchange code for tokens
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [REDIRECT_URI]
                }
            },
            scopes=SCOPES
        )
        flow.redirect_uri = REDIRECT_URI
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Get user info
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        
        # Store user and tokens in Supabase
        user_data = {
            "email": user_info['email'],
            "name": user_info['name'],
            "google_id": user_info['id'],
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_expiry": credentials.expiry.isoformat() if credentials.expiry else None
        }
        
        # Check if user exists, if not create new user
        existing_user = supabase.table("users").select("*").eq("email", user_info['email']).execute()
        
        if existing_user.data:
            # Update existing user
            user_response = supabase.table("users").update(user_data).eq("email", user_info['email']).execute()
            user_id = existing_user.data[0]['id']
        else:
            # Create new user
            user_response = supabase.table("users").insert(user_data).execute()
            user_id = user_response.data[0]['id']
        
        # Parse emails and create job applications
        await parse_and_classify_emails(credentials, user_id)
        
        # Redirect to frontend dashboard
        return RedirectResponse(url=f"http://localhost:3000/dashboard?auth=success")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
