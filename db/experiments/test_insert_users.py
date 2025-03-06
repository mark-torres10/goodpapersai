from db.models import User
from db.create_new_records import create_new_user
from db.insert_records_to_supabase import insert_new_user

mock_users = [
    {
        "email": "test@test.com",
        "name": "Test User",
        "username": "testuser"
    },
    {
        "email": "test2@test.com",
        "name": "Test User 2",
        "username": "testuser2"
    },
    {
        "email": "markptorres1@gmail.com",
        "name": "Mark Torres",
        "username": "markptorres"
    },
]


def insert_mock_users():
    for user in mock_users:
        user: User = create_new_user(user["email"], user["name"], user["username"])
        user_id = insert_new_user(user)
        print(f"Inserted user {user_id} with email {user.email}")


if __name__ == "__main__":
    insert_mock_users()
