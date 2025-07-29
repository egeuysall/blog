// Package api provides the HTTP router for the backend service.
//
// This file defines the Router function, which sets up the main HTTP routes and middleware
// for the application using the chi router. It includes both public and protected API endpoints,
// and applies global middleware for security, performance, and request handling.
//
// # Middleware
//
// The following middleware are applied globally to all routes:
//   - Recoverer: Recovers from panics and returns a 500 error.
//   - RealIP: Sets the RemoteAddr to the client's real IP address.
//   - Timeout: Sets a 3-second timeout for all requests.
//   - NoCache: Adds headers to prevent client-side caching.
//   - Compress: Enables response compression with a compression level of 5.
//   - httprate.LimitByIP: Limits each IP to 30 requests per minute.
//   - appmid.SetContentType: Sets the Content-Type header for responses.
//   - appmid.Cors: Handles Cross-Origin Resource Sharing (CORS) settings.
//
// # Routes
//
// Public routes (no authentication required):
//   - GET /         : Handled by handlers.HandleRoot
//   - GET /ping     : Handled by handlers.HandlePing
//
// Protected routes (authentication required):
//   - All routes under /v1 require a valid authentication token via appmid.RequireAuth().
//
// # Usage
//
// Import this package and call api.Router() to obtain the configured *chi.Mux router
// for use in your HTTP server.
//
// Example:
//   router := api.Router()
//   http.ListenAndServe(":8080", router)
//
package api

import (
	"time"

	// "github.com/egeuysall/cove/internal/handlers"
	// appmid "github.com/egeuysall/cove/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

// Router sets up the HTTP routes and middleware for the backend API.
//
// Returns a *chi.Mux router with all routes and middleware configured.
func Router() *chi.Mux {
	r := chi.NewRouter()

	// Global middleware
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
	r.Get("/", handlers.HandleRoot)
	r.Get("/ping", handlers.HandlePing)

	// Protected API v1 routes
	r.Route("/v1", func(r chi.Router) {
		r.Use(appmid.RequireAuth())
	})

	return r
}