import os

from dotenv import load_dotenv

from lib.constants import PROJECT_ROOT_DIR

env_paths = [
    os.path.join(PROJECT_ROOT_DIR, ".env"),
]

for env_path in env_paths:
    load_dotenv(env_path)

DIGITAL_OCEAN_PERSONAL_ACCESS_TOKEN = os.environ.get("DIGITAL_OCEAN_PERSONAL_ACCESS_TOKEN")
DIGITAL_OCEAN_IP_ADDRESS = os.environ.get("DIGITAL_OCEAN_IP_ADDRESS")

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")

SUPABASE_PROJECT_NAME = os.environ.get("SUPABASE_PROJECT_NAME")
SUPABASE_POSTGRES_PW = os.environ.get("SUPABASE_POSTGRES_PW")
SUPABASE_PROJECT_URL = os.environ.get("SUPABASE_PROJECT_URL")
SUPABASE_PROJECT_API_KEY = os.environ.get("SUPABASE_PROJECT_API_KEY")
