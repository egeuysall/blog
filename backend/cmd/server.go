package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/egeuysall/blog/internal/utils"

	"github.com/egeuysall/blog/internal/api"
	supabase "github.com/egeuysall/blog/internal/supabase"
	generated "github.com/egeuysall/blog/internal/supabase/generated"
	"github.com/joho/godotenv"
)

func main() {
	log.Println("Starting blog server with automated deployment")

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading environment")
	}

	dbConn := supabase.Connect()
	defer dbConn.Close()

	queries := generated.New(dbConn)

	utils.Init(queries)

	router := api.Router()

	portStr := os.Getenv("PORT")

	if portStr == "" {
		log.Fatal("PORT not set in environment")
	}

	addr := fmt.Sprintf(":%s", portStr)

	log.Printf("Server starting on http://localhost%s", addr)
	err = http.ListenAndServe(addr, router)

	if err != nil {
		log.Fatal(err)
	}
}
