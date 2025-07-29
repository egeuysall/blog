-- name: CreatePost :one
INSERT INTO blog_posts (id, title, slug, tags, created_by)
VALUES ($1, $2, $3, $4, $5)
    RETURNING *;

-- name: ListPaginatedPosts :many
SELECT * FROM blog_posts
ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;