CREATE TABLE IF NOT EXISTS bookmark (
    _id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    link TEXT NOT NULL,
    title VARCHAR(200) NOT NULL
);