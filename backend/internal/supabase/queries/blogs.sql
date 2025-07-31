-- name: CreatePost :exec
INSERT INTO blog_posts (
    title,
    content,
    slug,
    tags,
    created_by,
    cover_link
)
VALUES (
           $1, $2, $3, $4, $5, $6
       );

-- name: ListPaginatedPosts :many
SELECT
    id,
    title,
    content,
    slug,
    tags,
    created_by,
    cover_link,
    created_at
FROM blog_posts
ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;

-- name: GetBlogBySlug :one
SELECT
    id,
    title,
    content,
    slug,
    tags,
    created_by,
    cover_link,
    created_at
FROM blog_posts
WHERE slug = $1;
