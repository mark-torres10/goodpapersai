ALTER TABLE papers
ADD CONSTRAINT unique_paper_url UNIQUE (url);

ALTER TABLE updates
ADD CONSTRAINT unique_update_paper_user UNIQUE (paper_id, user_id);

ALTER TABLE user_paper_records
ADD CONSTRAINT unique_user_paper UNIQUE (user_id, paper_id);

ALTER TABLE users
ADD CONSTRAINT unique_user_email UNIQUE (email);
