"""Base logic for creating new records in the database."""
from typing import Literal

from api.arxiv_fetch_api import fetch_paper_from_arxiv_given_url
from db.models import ArxivPaper, Update
from lib.helper import generate_current_datetime_str

# default ID to add for records until the ID is assigned by the database
default_stub_id = 999


def user_adds_new_arxiv_paper(
    user_id: int,
    arxiv_url: str,
    reading_status: Literal[
        "added to library", "want to read", "reading", "finished reading"
    ] = "added to library"
) -> dict[str, ArxivPaper | Update]:
    """User adds a new paper to their library.
    
    When this happens, we create the following new records:
    - ArxivPaper
    - Update

    We then return these records to be handled by the client.
    """
    arxiv_paper = fetch_paper_from_arxiv_given_url(arxiv_url)
    if arxiv_paper is None:
        raise ValueError("Failed to fetch paper from Arxiv")
    arxiv_paper = ArxivPaper(
        paper_id=default_stub_id,
        title=arxiv_paper["title"],
        authors=arxiv_paper["authors"],
        abstract=arxiv_paper["abstract"],
        url=arxiv_url,
        created_at=generate_current_datetime_str(),
        arxiv_id=arxiv_paper["arxiv_id"],
        categories=arxiv_paper["categories"],
        comment=arxiv_paper["comment"],
        links=arxiv_paper["links"],
        published_date=arxiv_paper["published_date"],
        updated_date=arxiv_paper["updated_date"],
    )
    update = Update(
        paper_id=default_stub_id,
        user_id=user_id,
        message="User added this paper to their library.",
        reading_status=reading_status,
        created_at=generate_current_datetime_str(),
    )
    return {
        "arxiv_paper": arxiv_paper,
        "update": update,
    }
