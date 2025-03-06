"""Manages actual logic for inserting records into the Supabase database."""

from typing import Literal

from db.create_new_records import user_adds_new_arxiv_paper
from db.models import Paper, Update, UserPaperRecord, User
from db.supabase_db import supabase_client
from lib.logger import get_logger

logger = get_logger(__name__)


def insert_new_paper(paper: Paper) -> int:
    """Inserts a new paper into the database."""
    paper_dict = paper.model_dump()
    paper_dict.pop("paper_id") # remove the stub paper_id, get the actual ID from the database
    response = (
        supabase_client.table("papers")
        .upsert(paper_dict, on_conflict="url") # for papers, the URL is unique.
        .execute()
    )
    return response.data[0]["paper_id"]


def insert_new_update(update: Update, paper_id: int) -> int:
    """Inserts a new update into the database."""
    update_dict = update.model_dump()
    update_dict.pop("update_id") # remove the stub update_id, get the actual ID from the database
    update_dict["paper_id"] = paper_id # assign the paper_id to the update
    response = (
        supabase_client.table("updates")
        .upsert(update_dict, on_conflict="paper_id, user_id") # so we get the ID if the record exists, we just upsert.
        .execute()
    )
    return response.data[0]["update_id"]


def insert_new_user_paper_record(user_paper_record: UserPaperRecord) -> dict[str, int]:
    """Inserts a new user paper record into the database."""
    response = (
        supabase_client.table("user_paper_records")
        .upsert(user_paper_record.model_dump(), on_conflict="user_id, paper_id")
        .execute()
    )
    res = {
        "user_id": response.data[0]["user_id"],
        "paper_id": response.data[0]["paper_id"],
    }
    logger.info(f"Inserted new user paper record into the database.")
    return res


def user_inserts_new_paper(
    user_id: int,
    url: str,
    source: str,
    reading_status: Literal["want to read", "reading", "finished reading", "skipped", "archived"],
    reading_progress: float,
) -> dict[str, int]:
    """User inserts a new paper into their library.
    
    Steps:
    1. Add the paper to the database.
    2. Add the Update record to the database.
    3. Add the UserPaperRecord to the User's personal library.
    """
    # Create record for ArXiV paper and Update record.
    if source == "arxiv":
        res = user_adds_new_arxiv_paper(
            user_id=user_id,
            arxiv_url=url,
            reading_status=reading_status,
            reading_progress=reading_progress,
        )
    else:
        raise ValueError(f"Invalid source: {source}")
    paper: Paper = res["paper"]
    update: Update = res["update"]
    logger.info(f"Fetched new paper from {source}: {paper.title}")
    logger.info(f"Fetched new update for user {user_id}.")

    # insert the records into the database.
    paper_id = insert_new_paper(paper)
    update_id = insert_new_update(update, paper_id)

    # add to user's library.
    user_paper_record = UserPaperRecord(
        user_id=user_id, paper_id=paper_id
    )
    insert_new_user_paper_record(user_paper_record)

    logger.info(f"Inserted new paper and update into the database.")
    return {
        "paper_id": paper_id,
        "update_id": update_id,
    }


def insert_new_user(user: User) -> int:
    """Inserts a new user into the database."""
    user_dict = user.model_dump()
    user_dict.pop("user_id") # remove the stub user_id, get the actual ID from the database
    response = (
        supabase_client.table("users")
        .upsert(user_dict, on_conflict="email")
        .execute()
    )
    return response.data[0]["user_id"]
