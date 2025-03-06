"""Pydantic models for the database."""

from typing import Literal

from pydantic import BaseModel


class Paper(BaseModel):
    """Pydantic model for a paper.
    
    Added to base database of all papers. Shared across all users.
    """
    paper_id: int
    title: str
    authors: list[str]
    abstract: str
    url: str
    created_at: str


class ArxivPaper(Paper):
    """Pydantic model for a paper from Arxiv.
    
    Added to base database of all papers. Shared across all users.
    """
    arxiv_id: str
    categories: list[str]
    comment: str
    links: dict[str, str]
    published_date: str
    updated_date: str


class Update(BaseModel):
    """Pydantic model for an update."""
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
