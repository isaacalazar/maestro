from supabase import Client, create_client

def create_supabase_client(url, key):
    supabase: Client = create_client(url, key)
    return supabase
