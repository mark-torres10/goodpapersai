"""Given a list of user ids, fetch their relevant data.

This data is:
- Their User profile.
- The papers in their library.
- The updates they've made to their library.
"""

from typing import Dict, List, Any
from db.models import User, Paper, Update
from db.fetch_records import (
    get_user_by_id,
    get_papers_for_user,
    get_updates_for_user
)


def fetch_data_for_users(user_ids: list[int]) -> dict:
    """Fetch data for users.
    
    For each user id, retrieve:
    - The user profile
    - Papers in their library
    - Updates they've made to their library
    
    Returns:
        A dictionary with user_ids as keys, each containing a dictionary with
        'user', 'papers', and 'updates' as keys.
    """
    result = {}
    
    for user_id in user_ids:
        user_data = {}
        
        # Fetch user profile using the utility function
        user = get_user_by_id(user_id)
        
        if not user:
            # Skip this user if no data found
            continue
        
        user_data['user'] = user
        
        # Fetch papers in user's library using the utility function
        papers = get_papers_for_user(user_id)
        user_data['papers'] = papers
        
        # Fetch updates made by the user using the utility function
        updates = get_updates_for_user(user_id)
        user_data['updates'] = updates
        
        # Add to result
        result[user_id] = user_data
    
    return result


if __name__ == "__main__":
    user_ids = [3, 4]
    result = fetch_data_for_users(user_ids)
    
    # Print detailed information about each user, their papers, and updates
    for user_id, data in result.items():
        user = data['user']
        papers = data['papers']
        updates = data['updates']
        
        print(f"\nUser {user_id} ({user.username}):")
        print(f"  - {len(papers)} papers in library")
        print(f"  - {len(updates)} total updates made")
        
        # Create a dictionary to map paper_id to updates for easier lookup
        paper_updates = {}
        for update in updates:
            if update.paper_id not in paper_updates:
                paper_updates[update.paper_id] = []
            paper_updates[update.paper_id].append(update)
        
        # Print information about each paper and its latest update
        print("\n  Papers in library:")
        for i, paper in enumerate(papers, 1):
            print(f"  {i}. \"{paper.title}\" by {', '.join(paper.authors)}")
            
            # Find updates for this paper
            paper_specific_updates = paper_updates.get(paper.paper_id, [])
            if paper_specific_updates:
                # Sort updates by created_at (assumes ISO date format or similar sortable format)
                latest_update = sorted(paper_specific_updates, key=lambda u: u.created_at, reverse=True)[0]
                print(f"     Latest update: {latest_update.created_at} - {latest_update.reading_status}")
                print(f"     Message: {latest_update.message if latest_update.message else 'No message'}")
                print(f"     Reading progress: {latest_update.reading_progress * 100:.0f}%")
            else:
                print("     No updates for this paper")
            
        print("\n" + "-"*50)
