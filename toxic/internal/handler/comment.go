package handler

import (
	"encoding/json"
	"log"
	"myapp/internal/db"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type CommentRequest struct {
	Text        string `json:"text_comment"`
	UserID      int    `json:"user_id"`
	CorrectedAI bool   `json:"corrected_ai"`
}

func AddComment(w http.ResponseWriter, r *http.Request) {
	var req CommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	_, err := db.DB.Exec("INSERT INTO comments (text_comment, user_id, corrected_ai, timestamp) VALUES ($1, $2, $3, $4)",
		req.Text, req.UserID, req.CorrectedAI, time.Now())
	if err != nil {
		log.Printf("Error executing query: %v", err)
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"corrected": req.CorrectedAI,
	})
}

func GetAllComments(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, text_comment, user_id, corrected_ai, timestamp FROM comments")
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var comments []map[string]interface{}
	for rows.Next() {
		var id, userID int
		var text string
		var corrected bool
		var timestamp time.Time

		err := rows.Scan(&id, &text, &userID, &corrected, &timestamp)
		if err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}

		comments = append(comments, map[string]interface{}{
			"id":        id,
			"text":      text,
			"user_id":   userID,
			"corrected": corrected,
			"timestamp": timestamp,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}

func GetCommentsByUser(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "User ID not provided", http.StatusBadRequest)
		return
	}

	userID, _ := strconv.Atoi(parts[2])
	rows, err := db.DB.Query("SELECT id, text_comment, corrected_ai, timestamp FROM comments WHERE user_id=$1", userID)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var comments []map[string]interface{}
	for rows.Next() {
		var id int
		var text string
		var corrected bool
		var timestamp time.Time

		err := rows.Scan(&id, &text, &corrected, &timestamp)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		comments = append(comments, map[string]interface{}{
			"id":        id,
			"text":      text,
			"corrected": corrected,
			"timestamp": timestamp,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}
