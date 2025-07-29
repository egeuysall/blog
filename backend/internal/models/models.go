//
// Package models defines the core data structures and types used throughout the backend service.
//
// This file is intended to contain Go structs and type definitions that represent the main entities
// in the application's domain model, such as users, posts, comments, and any other resources
// that are persisted in the database or exchanged via the API.
//
// # Usage
//
// - Define your application's data models as Go structs in this file.
// - These models can be used for database operations, API request/response payloads, and internal logic.
// - Keep this file focused on type definitions and avoid including business logic or database access code.
//
// # Example
//
//   type User struct {
//       ID        string    `json:"id"`
//       Email     string    `json:"email"`
//       CreatedAt time.Time `json:"created_at"`
//   }
//
// Add new models below as your application grows.
//
package models
