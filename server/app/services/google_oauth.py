from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv
import os

load_dotenv()

CLIENT_SECRETS = {
    "web": {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uris": [os.getenv("REDIRECT_URI")],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token"
    }
}

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "openid",
    "email",
    "profile"
]

def get_flow():
    return Flow.from_client_config(
        CLIENT_SECRETS,
        scopes=SCOPES,
        redirect_uri=os.getenv("REDIRECT_URI")
    )

def get_credentials_from_code(code):
    flow = get_flow()
    flow.fetch_token(code=code)
    return flow.credentials
