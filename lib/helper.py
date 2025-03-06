from datetime import datetime, timezone

from lib.constants import timestamp_format

def generate_current_datetime_str() -> str:
    return datetime.now(timezone.utc).strftime(timestamp_format)
