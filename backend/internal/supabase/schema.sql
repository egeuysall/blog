CREATE TABLE blog_posts (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            title TEXT NOT NULL,
                            content TEXT NOT NULL DEFAULT '',
                            slug TEXT UNIQUE NOT NULL,
                            tags TEXT[] DEFAULT '{}',
                            created_at TIMESTAMPTZ DEFAULT NOW(),
                            created_by TEXT NOT NULL,
                            cover_link TEXT
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
