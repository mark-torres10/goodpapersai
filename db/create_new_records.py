"""Base logic for creating new records in the database."""
from typing import Literal

from api.arxiv_fetch_api import fetch_paper_from_arxiv_given_url
from db.models import ArxivPaper, Paper, Update, User
from lib.helper import generate_current_datetime_str
from lib.logger import get_logger

logger = get_logger(__name__)

# default ID to add for records until the ID is assigned by the database
default_stub_id = 999


def user_adds_new_arxiv_paper(
    user_id: int,
    arxiv_url: str,
    reading_status: Literal[
        "added to library", "want to read", "reading", "finished reading"
    ] = "added to library",
    reading_progress: float = 0.0 # decimal, 0 to 1
) -> dict[str, Paper | Update]:
    """User adds a new paper to their library.
    
    When this happens, we create the following new records:
    - ArxivPaper
    - Update

    We then return these records to be handled by the client.
    """
    arxiv_paper = fetch_paper_from_arxiv_given_url(arxiv_url)
    if arxiv_paper is None:
        raise ValueError("Failed to fetch paper from Arxiv")
    arxiv_paper_obj = ArxivPaper(
        arxiv_id=arxiv_paper["arxiv_id"],
        arxiv_url=arxiv_url,
        abstract=arxiv_paper["abstract"],
        categories=arxiv_paper["categories"],
        comment=arxiv_paper["comment"],
        links=arxiv_paper["links"],
        published_date=arxiv_paper["published_date"],
        updated_date=arxiv_paper["updated_date"],
    )
    arxiv_paper_dict_str: str = arxiv_paper_obj.model_dump_json()
    paper = Paper(
        paper_id=default_stub_id,
        title=arxiv_paper["title"],
        authors=arxiv_paper["authors"],
        preview=arxiv_paper["abstract"],
        url=arxiv_url,
        source="arxiv",
        metadata_str=arxiv_paper_dict_str,
        created_at=generate_current_datetime_str(),
    )
    update = Update(
        update_id=default_stub_id,
        paper_id=default_stub_id,
        user_id=user_id,
        message="User added this paper to their library.",
        reading_status=reading_status,
        reading_progress=reading_progress,
        created_at=generate_current_datetime_str(),
    )
    return {"paper": paper, "update": update}


def create_new_user(email: str, name: str, username: str) -> User:
    logger.info(f"Creating new user with email: {email}, name: {name}, username: {username}")
    user = User(
        user_id=default_stub_id,
        email=email,
        name=name,
        username=username,
        created_at=generate_current_datetime_str(),
    )
    return user
