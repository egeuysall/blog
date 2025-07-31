package handlers

import (
	"encoding/json"
	"errors"
	"github.com/egeuysall/blog/internal/models"
	supabase "github.com/egeuysall/blog/internal/supabase/generated"
	"github.com/egeuysall/blog/internal/utils"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"net/http"
)

func HandleGetPaginatedBlogs(w http.ResponseWriter, r *http.Request) {
	page := utils.GetQueryInt(r, "page", 1)
	limit := utils.GetQueryInt(r, "limit", 10)
	if page < 1 || limit < 1 || limit > 100 {
		utils.SendError(w, "Invalid pagination parameters", http.StatusBadRequest)
		return
	}

	offset := (page - 1) * limit

	limitParams := supabase.ListPaginatedPostsParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	}

	posts, err := utils.Queries.ListPaginatedPosts(r.Context(), limitParams)

	if err != nil {
		utils.SendError(w, "Failed to fetch posts", http.StatusInternalServerError)
		return
	}

	correctedPosts := make([]models.Blog, len(posts))

	for i, post := range posts {
		correctedPosts[i] = models.Blog{
			post.ID.String(),
			post.Title,
			post.Content,
			post.Slug,
			post.Tags,
			post.CreatedAt.Time,
			post.CreatedBy,
			post.CoverLink.String,
		}
	}

	utils.SendJson(w, correctedPosts, http.StatusOK)
}

func HandleCreateBlog(w http.ResponseWriter, r *http.Request) {
	var req models.Blog

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if req.Title == "" {
		utils.SendError(w, "Title is required", http.StatusBadRequest)
		return
	}

	if req.Slug == "" {
		utils.SendError(w, "Slug is required", http.StatusBadRequest)
		return
	}

	var cover pgtype.Text
	if req.CoverLink == "" {
		cover.Valid = false
	} else {
		cover.String = req.CoverLink
		cover.Valid = true
	}

	createParams := supabase.CreatePostParams{
		Title:     req.Title,
		Content:   req.Content,
		Slug:      req.Slug,
		Tags:      req.Tags,
		CreatedBy: req.CreatedBy,
		CoverLink: cover,
	}

	err := utils.Queries.CreatePost(r.Context(), createParams)
	if err != nil {
		utils.SendError(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	utils.SendJson(w, "Post created successfully", http.StatusCreated)
}

func HandleGetBlogBySlug(w http.ResponseWriter, r *http.Request) {
	blogSlug := chi.URLParam(r, "slug")

	if blogSlug == "" {
		utils.SendError(w, "Missing blogSlug parameter", http.StatusBadRequest)
		return
	}

	blog, err := utils.Queries.GetBlogBySlug(r.Context(), blogSlug)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			utils.SendError(w, "Blog not found", http.StatusNotFound)
			return
		}

		utils.SendError(w, "Failed to get blog", http.StatusInternalServerError)
		return
	}

	resp := models.Blog{
		ID:        blog.ID.String(),
		Title:     blog.Title,
		Content:   blog.Content,
		Slug:      blog.Slug,
		Tags:      blog.Tags,
		CreatedAt: blog.CreatedAt.Time,
		CreatedBy: blog.CreatedBy,
		CoverLink: blog.CoverLink.String,
	}

	utils.SendJson(w, resp, http.StatusOK)
}
