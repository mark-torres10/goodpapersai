"""Fetch records from the database."""

from typing import List, Dict, Any, Optional

from db.models import Paper, User, Update, UserPaperRecord
from db.supabase_db import supabase_client


def get_user_by_id(user_id: int) -> Optional[User]:
    """Get a user by their ID.
    
    Args:
        user_id: The ID of the user to fetch
        
    Returns:
        User object if found, None otherwise
    """
    response = (
        supabase_client.table("users")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    
    if response.data:
        return User(**response.data[0])
    return None


def get_paper_by_id(paper_id: int) -> Optional[Paper]:
    """Get a paper by its ID.
    
    Args:
        paper_id: The ID of the paper to fetch
        
    Returns:
        Paper object if found, None otherwise
    """
    response = (
        supabase_client.table("papers")
        .select("*")
        .eq("paper_id", paper_id)
        .execute()
    )
    
    if response.data:
        return Paper(**response.data[0])
    return None


def get_papers_for_user(user_id: int) -> List[Paper]:
    """Get all papers for a user.
    
    Args:
        user_id: The ID of the user to fetch papers for
        
    Returns:
        List of Paper objects belonging to the user
    """
    # First get all paper_ids for this user
    paper_ids_response = (
        supabase_client.table("user_paper_records")
        .select("paper_id")
        .eq("user_id", user_id)
        .execute()
    )
    
    if not paper_ids_response.data:
        return []
    
    paper_ids = [record["paper_id"] for record in paper_ids_response.data]
    
    # Then fetch all papers with those IDs
    papers_response = (
        supabase_client.table("papers")
        .select("*")
        .in_("paper_id", paper_ids)
        .execute()
    )
    
    return [Paper(**paper) for paper in papers_response.data]


def get_updates_for_user(user_id: int) -> List[Update]:
    """Get all updates made by a user.
    
    Args:
        user_id: The ID of the user to fetch updates for
        
    Returns:
        List of Update objects created by the user
    """
    response = (
        supabase_client.table("updates")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    
    return [Update(**update) for update in response.data]


def get_updates_for_paper(paper_id: int) -> List[Update]:
    """Get all updates for a specific paper.
    
    Args:
        paper_id: The ID of the paper to fetch updates for
        
    Returns:
        List of Update objects for the paper
    """
    response = (
        supabase_client.table("updates")
        .select("*")
        .eq("paper_id", paper_id)
        .execute()
    )
    
    return [Update(**update) for update in response.data]


def get_user_paper_record(user_id: int, paper_id: int) -> Optional[UserPaperRecord]:
    """Get the record linking a user to a paper.
    
    Args:
        user_id: The ID of the user
        paper_id: The ID of the paper
        
    Returns:
        UserPaperRecord if found, None otherwise
    """
    response = (
        supabase_client.table("user_paper_records")
        .select("*")
        .eq("user_id", user_id)
        .eq("paper_id", paper_id)
        .execute()
    )
    
    if response.data:
        return UserPaperRecord(**response.data[0])
    return None