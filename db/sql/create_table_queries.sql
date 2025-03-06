create table if not exists papers (
    paper_id int generated always as identity primary key,
    title text not null,
    authors text[] not null,
    preview text not null,
    url text not null,
    source text not null,
    metadata_str text,
    created_at text not null
);

create table if not exists updates (
    update_id int generated always as identity primary key,
    paper_id int not null references papers(paper_id),
    user_id int not null references users(user_id),
    message text not null,
    reading_status text not null,
    reading_progress float not null,
    created_at text not null
);

create table if not exists users (
    user_id int generated always as identity primary key,
    email text not null,
    name text not null,
    username text not null,
    created_at text not null
);

create table if not exists user_paper_records (
    user_id int not null references users(user_id),
    paper_id int not null references papers(paper_id),
    primary key (user_id, paper_id)
);
