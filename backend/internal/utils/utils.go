package utils

import (
	"encoding/json"
	generated "github.com/egeuysall/blog/internal/supabase/generated"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"log"
	"net/http"
	"strconv"
)

var Queries *generated.Queries

func Init(q *generated.Queries) {
	Queries = q
}

func SendJson(w http.ResponseWriter, message interface{}, statusCode int) {
	w.WriteHeader(statusCode)

	response := map[string]interface{}{"data": message}
	err := json.NewEncoder(w).Encode(response)

	if err != nil {
		SendError(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}

func SendError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)

	errorResponse := map[string]string{"error": message}
	err := json.NewEncoder(w).Encode(errorResponse)

	if err != nil {
		log.Printf("SendError encoding failed: %v", err)
	}
}

func ParseUUID(str string) (pgtype.UUID, error) {
	var id pgtype.UUID
	err := id.Scan(str)
	return id, err
}

func UUIDToString(u pgtype.UUID) string {
	if !u.Valid {
		return ""
	}
	return uuid.UUID(u.Bytes).String()
}

func GetQueryInt(r *http.Request, key string, defaultVal int) int {
	q := r.URL.Query().Get(key)
	if q == "" {
		return defaultVal
	}
	i, err := strconv.Atoi(q)
	if err != nil {
		return defaultVal
	}
	return i
}
