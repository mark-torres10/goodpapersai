"""Client for interacting with Supabase."""

from lib.env_vars import SUPABASE_PROJECT_URL, SUPABASE_PROJECT_API_KEY
from supabase import create_client, Client

supabase_client: Client = create_client(SUPABASE_PROJECT_URL, SUPABASE_PROJECT_API_KEY)
