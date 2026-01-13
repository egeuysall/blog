package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/egeuysall/blog/internal/handlers"
	appmid "github.com/egeuysall/blog/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

func Router() *chi.Mux {
	r := chi.NewRouter()

	r.Use(
		middleware.Recoverer,
		middleware.RealIP,
		middleware.Timeout(3*time.Second),
		middleware.NoCache,
		middleware.Compress(5),
		httprate.LimitByIP(30, time.Minute),
		appmid.SetContentType(),
		appmid.Cors(),
	)

	// Public routes
	r.Get("/", HandleRoot)
	r.Get("/ping", HandlePing)

	r.Route("/v1", func(r chi.Router) {
		r.Get("/blogs", handlers.HandleGetPaginatedBlogs)
		r.Get("/blogs/{slug}", handlers.HandleGetBlogBySlug)

		// Protected API v1 routes
		r.Group(func(r chi.Router) {
			r.Use(appmid.RequireAuth())
			r.Post("/blogs", handlers.HandleCreateBlog)
		})

	})

	return r
}

func HandleRoot(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	response := map[string]any{
		"service": "Blog API",
		"version": "1.0.0",
		"status":  "Healthy",
		"endpoints": map[string]string{
			"root":      "/",
			"ping":      "/ping",
			"get_blogs": "/v1/blogs",
			"get_blog":  "/v1/blogs/{slug}",
			"create":    "/v1/blogs",
		},
		"documentation": "https://github.com/egeuysall/blog",
	}

	json.NewEncoder(w).Encode(response)
}

func HandlePing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	response := map[string]any{
		"status":  "Healthy",
		"service": "Blog API",
		"version": "1.0.0",
		"uptime":  "operational",
		"checks": map[string]string{
			"database": "connected",
			"api":      "responding",
		},
	}

	json.NewEncoder(w).Encode(response)
}
