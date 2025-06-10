import os
from app.utils.supabase import create_supabase_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_supabase_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
