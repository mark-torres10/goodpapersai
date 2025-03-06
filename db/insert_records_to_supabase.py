"""Manages actual logic for inserting records into the Supabase database."""

from db.models import ArxivPaper, Update
from db.supabase import supabase


def insert_new_arxiv_paper(arxiv_paper: ArxivPaper) -> int:
    """Inserts a new ArXiV paper into the database (if it doesn't already exist).
    
    Returns the paper_id of the newly inserted paper.
    """
    arxiv_paper_dict = arxiv_paper.model_dump()
    arxiv_paper_dict.pop("paper_id") # remove the stub paper_id, get the actual ID from the database
    response = (
        supabase.table("arxiv_papers")
        .insert(arxiv_paper_dict)
        .select("paper_id")
        .execute()
    )
    return response.data[0]["paper_id"]


def insert_new_update(update: Update):
    pass


def user_inserts_new_paper(user_id: int, arxiv_url: str):
    """User inserts a new paper into their library."""
    # 1. Check if the paper already exists in the database
    # 2. If it does, return the paper_id
    # 3. If it doesn't, insert the paper into the database
    # 4. Create a new "Update" record for the user

    pass
