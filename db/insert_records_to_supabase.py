"""Manages actual logic for inserting records into the Supabase database."""

from typing import Literal

from db.create_new_records import user_adds_new_arxiv_paper
from db.models import ArxivPaper, Update
from db.supabase import supabase
from lib.logger import get_logger

logger = get_logger(__name__)


def insert_new_arxiv_paper(arxiv_paper: ArxivPaper) -> int:
    """Inserts a new ArXiV paper into the database (if it doesn't already exist).
    
    Returns the paper_id of the newly inserted paper.
    """
    arxiv_paper_dict = arxiv_paper.model_dump()
    arxiv_paper_dict.pop("paper_id") # remove the stub paper_id, get the actual ID from the database
    response = (
        supabase.table("arxiv_papers")
        .upsert(arxiv_paper_dict, on_conflict="arxiv_id") # for ArXiV papers, the ArXiV ID is unique.
        .select("paper_id")
        .execute()
    )
    return response.data[0]["paper_id"]


def insert_new_update(update: Update, paper_id: int) -> int:
    """Inserts a new update into the database."""
    update_dict = update.model_dump()
    update_dict.pop("update_id") # remove the stub update_id, get the actual ID from the database
    update_dict["paper_id"] = paper_id # assign the paper_id to the update
    response = (
        supabase.table("updates")
        .upsert(update_dict, on_conflict="paper_id, user_id") # so we get the ID if the record exists, we just upsert.
        .select("update_id")
        .execute()
    )
    return response.data[0]["update_id"]


def user_inserts_new_paper(
    user_id: int,
    arxiv_url: str,
    reading_status: Literal["want to read", "reading", "finished reading", "skipped", "archived"],
    reading_progress: float,
) -> dict[str, int]:
    """User inserts a new paper into their library."""
    res = user_adds_new_arxiv_paper(
        user_id=user_id,
        arxiv_url=arxiv_url,
        reading_status=reading_status,
        reading_progress=reading_progress,
    )
    arxiv_paper: ArxivPaper = res["arxiv_paper"]
    update: Update = res["update"]
    logger.info(f"Fetched new paper from ArXiV: {arxiv_paper.arxiv_id}")
    logger.info(f"Fetched new update for user {user_id}.")
    paper_id = insert_new_arxiv_paper(arxiv_paper)
    update_id = insert_new_update(update, paper_id)
    logger.info(f"Inserted new paper and update into the database.")
    return {
        "paper_id": paper_id,
        "update_id": update_id,
    }
