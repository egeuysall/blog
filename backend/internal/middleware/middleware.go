// Package middleware provides HTTP middleware utilities for the backend service.
//
// This package includes middleware for authentication (JWT validation), CORS handling,
// and setting response content types. It also provides helpers for extracting user
// information from the request context.
//
// # Middleware
//
//   - RequireAuth: Validates JWT tokens in the Authorization header, checks issuer, audience, and expiration,
//     and injects the user ID into the request context. Returns 401 Unauthorized on failure.
//   - Cors: Configures CORS headers for allowed origins, methods, and headers.
//   - SetContentType: Sets the Content-Type header to application/json for all responses.
//
// # Context Utilities
//
//   - UserIDFromContext: Retrieves the user ID from the request context, as set by RequireAuth.
//
// # Usage
//
// Import this package and use the middleware functions with your router:
//
//   r.Use(middleware.RequireAuth())
//   r.Use(middleware.Cors())
//   r.Use(middleware.SetContentType())
//
package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	// "github.com/egeuysall/cove/internal/utils"
	"github.com/go-chi/cors"
	"github.com/golang-jwt/jwt/v5"
)

// contextKey is a custom type for context keys used in this package.
type contextKey string

// userIDKey is the context key for storing the authenticated user's ID.
const userIDKey = contextKey("userID")

// RequireAuth returns a middleware that enforces JWT authentication.
//
// It expects the Authorization header in the form "Bearer <token>".
// The JWT is validated using the SUPABASE_JWT_SECRET, and issuer/audience are checked
// against SUPABASE_ISSUER and SUPABASE_AUDIENCE (or "authenticated" by default).
// On success, the user ID (subject) is added to the request context.
func RequireAuth() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			supabaseJWTSecret := strings.TrimSpace(os.Getenv("SUPABASE_JWT_SECRET"))
			supabaseIssuer := os.Getenv("SUPABASE_ISSUER")

			supabaseAudience := "authenticated"
			customAud := os.Getenv("SUPABASE_AUDIENCE")

			if customAud != "" {
				supabaseAudience = customAud
			}

			if supabaseJWTSecret == "" {
				log.Println("WARNING: SUPABASE_JWT_SECRET is not set")
				utils.SendError(w, "Internal server error", http.StatusInternalServerError)
				return
			}

			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				utils.SendError(w, "Unauthorized: missing Authorization header", http.StatusUnauthorized)
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				utils.SendError(w, "Unauthorized: invalid Authorization header format", http.StatusUnauthorized)
				return
			}
			tokenStr := parts[1]

			// Parse and validate the token
			token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
				}
				return []byte(supabaseJWTSecret), nil
			})

			if err != nil {
				log.Printf("JWT validation error: %v", err)
				utils.SendError(w, "Unauthorized: invalid token", http.StatusUnauthorized)
				return
			}

			if !token.Valid {
				utils.SendError(w, "Unauthorized: invalid token", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				utils.SendError(w, "Unauthorized: invalid token claims", http.StatusUnauthorized)
				return
			}

			// Validate the issuer if specified
			if iss, ok := claims["iss"].(string); !ok || (supabaseIssuer != "" && iss != supabaseIssuer) {
				log.Printf("Invalid issuer: %v, expected: %v", iss, supabaseIssuer)
				utils.SendError(w, "Unauthorized: invalid issuer", http.StatusUnauthorized)
				return
			}

			// Validate the audience
			if aud, ok := claims["aud"].(string); !ok || (supabaseAudience != "" && aud != supabaseAudience) {
				log.Printf("Invalid audience: %v, expected: %v", aud, supabaseAudience)
				utils.SendError(w, "Unauthorized: invalid audience", http.StatusUnauthorized)
				return
			}

			// Check for token expiration
			if exp, ok := claims["exp"].(float64); !ok || int64(exp) < time.Now().Unix() {
				utils.SendError(w, "Unauthorized: token expired", http.StatusUnauthorized)
				return
			}

			// Extract the user ID (subject)
			sub, ok := claims["sub"].(string)
			if !ok || sub == "" {
				utils.SendError(w, "Unauthorized: missing subject", http.StatusUnauthorized)
				return
			}

			// Add user ID to the context and continue the request
			ctx := context.WithValue(r.Context(), userIDKey, sub)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// UserIDFromContext extracts the user ID from the context as set by RequireAuth.
//
// Returns the user ID string and true if present, or an empty string and false otherwise.
func UserIDFromContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(userIDKey).(string)
	return userID, ok
}

// Cors returns a middleware that sets CORS headers for allowed origins, methods, and headers.
//
// Allowed origins: https://www.cove.egeuysal.com, http://localhost:3000
// Allowed methods: GET, POST, PATCH, DELETE, OPTIONS
// Allowed headers: Accept, Authorization, Content-Type, X-CSRF-Token
// Credentials are allowed. MaxAge is 3600 seconds.
func Cors() func(next http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://www.cove.egeuysal.com", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           3600,
	})
}

// SetContentType returns a middleware that sets the Content-Type header to application/json
// for all HTTP responses.
func SetContentType() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			next.ServeHTTP(w, r)
		})
	}
}
