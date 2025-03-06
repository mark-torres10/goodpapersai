"""Fetch records from the database."""

from db.models import UserPaper

def get_papers_for_user(user_id: int) -> list[UserPaper]:
    """Get all papers for a user."""
    query = """
    
    """