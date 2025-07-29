//
// Package db provides utilities for connecting to the Supabase (PostgreSQL) database.
//
// This file defines the Connect function, which establishes a connection pool to the database
// using the pgx and pgxpool libraries. The connection parameters are read from the SUPABASE_URL
// environment variable. The function configures sensible defaults for connection pooling and
// query execution, and ensures the database is reachable before returning the pool.
//
// # Usage
//
// Import this package and call db.Connect() to obtain a *pgxpool.Pool for database operations.
//
// Example:
//
//   import "github.com/yourorg/yourapp/internal/supabase"
//
//   func main() {
//       dbPool := db.Connect()
//       defer dbPool.Close()
//       // Use dbPool for queries...
//   }
//
// # Environment Variables
//
//   - SUPABASE_URL: The PostgreSQL connection string for your Supabase database.
//
// # Connection Pool Settings
//
//   - MaxConns:         10
//   - MinConns:         2
//   - MaxConnIdleTime:  30 minutes
//   - QueryExecMode:    Simple protocol
//
package db

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"os"
	"time"
)

// Connect establishes a connection pool to the Supabase PostgreSQL database.
//
// It reads the connection string from the SUPABASE_URL environment variable,
// configures the pool with sensible defaults, and pings the database to ensure
// connectivity. If any step fails, the function logs a fatal error and exits.
//
// Returns a *pgxpool.Pool ready for use in database operations.
func Connect() *pgxpool.Pool {
	connStr := os.Getenv("SUPABASE_URL")

	if connStr == "" {
		log.Fatal("SUPABASE_URL not set in environment")
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal("Failed to parse database URL: ", err)
	}

	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnIdleTime = 30 * time.Minute

	ctx := context.Background()
	pool, err := pgxpool.NewWithConfig(ctx, config)

	if err != nil {
		log.Fatal("Failed to create db pool")
	}

	err = pool.Ping(ctx)

	if err != nil {
		log.Fatalf("Unable to ping db: %s", err)
	}

	log.Println("Successfully connected Supabase database")
	return pool
}