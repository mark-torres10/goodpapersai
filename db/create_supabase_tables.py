"""Creates the tables in the Supabase database."""
from db.supabase import supabase
from lib.logger import get_logger

logger = get_logger(__name__)


def create_papers_table():
    query = """
        create table if not exists papers (
            paper_id int generated always as identity primary key,
            title text not null,
            authors text[] not null,
            abstract text not null,
            url text not null,
            created_at str not null,
        );
    """
    supabase.table("papers").execute(query)
    logger.info("Created papers table")


def create_arxiv_papers_table():
    query = """
        create table if not exists arxiv_papers (
            paper_id int generated always as identity primary key,
            title text not null,
            authors text[] not null,
            abstract text not null,
            url text not null,
            created_at str not null,
            arxiv_id str not null,
            categories text[] not null,
            comment text not null,
            links jsonb not null,
            published_date str not null,
            updated_date str not null,
        );
    """
    supabase.table("arxiv_papers").execute(query)
    logger.info("Created arxiv_papers table")


def create_updates_table():
    query = """
        create table if not exists updates (
            update_id int generated always as identity primary key,
            paper_id int not null,
            user_id int not null,
            message text not null,
            reading_status text not null,
            reading_progress float not null,
            created_at str not null
        );
    """
    supabase.table("updates").execute(query)
    logger.info("Created updates table")


def create_users_table():
    query = """
        create table if not exists users (
            user_id int generated always as identity primary key,
            email text not null,
            name text not null,
            username text not null,
            created_at str not null
        );
    """
    supabase.table("users").execute(query)
    logger.info("Created users table")


def create_tables():
    pass