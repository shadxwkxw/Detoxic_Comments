package handler

import (
	"encoding/json"
	"log"
	"myapp/internal/db"
	"myapp/internal/model"
	"net/http"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user model.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		log.Printf("Error decoding input: %v", err)
		return
	}

	db, err := db.GetDB()
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		log.Printf("Database connection error: %v", err)
		return
	}

	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM users WHERE login = $1", user.Login).Scan(&count)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		log.Printf("Error checking login uniqueness: %v", err)
		return
	}

	if count > 0 {
		http.Error(w, "User with this login already exists", http.StatusConflict)
		return
	}

	var id int
	query := "INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id"
	err = db.QueryRow(query, user.Login, user.Password).Scan(&id)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		log.Printf("Error executing insert: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":    id,
		"login": user.Login,
	})
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var user model.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		log.Printf("Error decoding input: %v", err)
		return
	}

	db, err := db.GetDB()
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		log.Printf("Database connection error: %v", err)
		return
	}

	var id int
	err = db.QueryRow("SELECT id FROM users WHERE login = $1 AND password = $2", user.Login, user.Password).Scan(&id)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		log.Printf("Login failed for user %s: %v", user.Login, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":    id,
		"login": user.Login,
	})
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	db, err := db.GetDB()
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		log.Printf("Database connection error: %v", err)
		return
	}

	rows, err := db.Query("SELECT id, login FROM users")
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		log.Printf("Error fetching users: %v", err)
		return
	}
	defer rows.Close()

	var users []map[string]interface{}
	for rows.Next() {
		var id int
		var login string
		if err := rows.Scan(&id, &login); err != nil {
			http.Error(w, "Error processing query result", http.StatusInternalServerError)
			log.Printf("Error scanning row: %v", err)
			return
		}

		users = append(users, map[string]interface{}{
			"id":    id,
			"login": login,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}
