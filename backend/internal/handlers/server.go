package handlers

import (
	"github.com/egeuysall/blog/internal/utils"
	"net/http"
)

func HandleRoot(w http.ResponseWriter, r *http.Request) {
	utils.SendJson(w, "Welcome to the Blog API. Blog API is the API of By Ege.", http.StatusOK)
}

func HandlePing(w http.ResponseWriter, r *http.Request) {
	utils.SendJson(w, "Pong", http.StatusOK)
}
