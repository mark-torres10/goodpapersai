from db.insert_records_to_supabase import user_inserts_new_paper

user_id = [3, 4]
arxiv_urls = [
    "https://arxiv.org/pdf/2410.08698",
    "https://arxiv.org/pdf/2407.01476",
    "https://arxiv.org/pdf/2405.10467",
    "https://arxiv.org/pdf/2502.08606",
    "https://arxiv.org/pdf/2309.11495",
    "https://arxiv.org/pdf/2502.06703",
    "https://arxiv.org/pdf/2310.06770",
    "https://arxiv.org/pdf/2210.02747",
    "https://arxiv.org/pdf/2410.11906",
    "https://arxiv.org/pdf/2406.17972",
    "https://arxiv.org/pdf/2209.07663",
    "https://arxiv.org/abs/2411.04434",
    "https://arxiv.org/pdf/2410.01792",
    "https://arxiv.org/pdf/2411.15662"
]

reading_statuses = [
    "want to read",
    "reading",
    "finished reading",
]

mock_user_insert_arxiv_papers = [
    {
        "user_id": user_id[i%2],
        "arxiv_url": arxiv_urls[i],
        "reading_status": reading_statuses[i%3],
        "reading_progress": 1.0 if reading_statuses[i%3] == "finished reading" else 0.0,
    }
    for i in range(len(arxiv_urls))
]

def insert_mock_user_insert_arxiv_papers():
    for user_insert_arxiv_paper in mock_user_insert_arxiv_papers:
        user_id = user_insert_arxiv_paper["user_id"]
        arxiv_url = user_insert_arxiv_paper["arxiv_url"]
        reading_status = user_insert_arxiv_paper["reading_status"]
        reading_progress = user_insert_arxiv_paper["reading_progress"]
        user_inserts_new_paper(
            user_id=user_id,
            url=arxiv_url,
            source="arxiv",
            reading_status=reading_status,
            reading_progress=reading_progress,
        )
        print(f"Inserted paper {arxiv_url} for user {user_id}")

if __name__ == "__main__":
    insert_mock_user_insert_arxiv_papers()
