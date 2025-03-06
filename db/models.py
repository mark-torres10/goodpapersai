"""Pydantic models for the database."""

from typing import Literal, Optional

from pydantic import BaseModel


class Paper(BaseModel):
    """Pydantic model for a paper.
    
    Added to base database of all papers. Shared across all users.
    """
    paper_id: int
    title: str
    authors: list[str]
    preview: str
    url: str
    source: str
    metadata_str: Optional[str] = None
    created_at: str


class ArxivPaper(BaseModel):
    """Pydantic model for a paper from Arxiv.
    
    Added to base database of all papers. Shared across all users.

    Added as "metadata" to the base Paper model.
    """
    arxiv_id: str
    arxiv_url: str
    abstract: str
    categories: Optional[list[str]] = None
    comment: Optional[str] = None
    links: Optional[dict[str, str]] = None
    published_date: Optional[str] = None
    updated_date: Optional[str] = None


class Update(BaseModel):
    """Pydantic model for an update."""
    update_id: int
    paper_id: int
    user_id: int
    message: str
    reading_status: Literal[
        "added to library",
        "want to read",
        "reading",
        "finished reading",
        "skipped",
        "archived"
    ] = "added to library"
    reading_progress: float = 0.0 # decimal, 0 to 1
    created_at: str


class User(BaseModel):
    """Pydantic model for a user."""
    user_id: int
    email: str
    name: str
    username: str
    created_at: str


class UserPaperRecord(BaseModel):
    """Pydantic model for a user's paper."""
    user_id: int
    paper_id: int


# not stored in DB, but hydrated in memory.
class UserPaperLibrary(BaseModel):
    """Pydantic model for a user's paper library."""
    user_paper_record_id: int
    user_id: int
    paper_ids: list[int]


class UserPaperCustomizations(BaseModel):
    """Pydantic model for user-specific customizations to their paper."""
    pass


class PaperAIAnalysis(BaseModel):
    """Pydantic model for AI analysis of a paper.
    
    Not user-specific, shared across all users for a given paper.
    """
    paper_id: int
    prompt: str
    response: str
    created_at: str
