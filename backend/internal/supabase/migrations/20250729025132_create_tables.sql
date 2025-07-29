CREATE TABLE blog_posts (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            title TEXT NOT NULL,
                            slug TEXT UNIQUE NOT NULL,
                            tags TEXT[] DEFAULT '{}',
                            created_at TIMESTAMPTZ DEFAULT NOW(),
                            created_by TEXT NOT NULL
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
