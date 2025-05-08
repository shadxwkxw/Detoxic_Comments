package main

import (
	"log"
	"net/http"

	"myapp/internal/db"
	"myapp/internal/handler"
)

func main() {
	err := db.Init()
	if err != nil {
		log.Fatal("DB init error:", err)
	}

	if err := db.Migrate(); err != nil {
		log.Fatal("Migration error:", err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/register", handler.RegisterUser)
	mux.HandleFunc("/login", handler.LoginUser)
	mux.HandleFunc("/comment", handler.AddComment)
	mux.HandleFunc("/comments", handler.GetAllComments)
	mux.HandleFunc("/comments/", handler.GetCommentsByUser)
	mux.HandleFunc("/users", handler.GetAllUsers)

	handlerWithCORS := enableCORS(mux)

	log.Println("Server started at :3000")
	log.Fatal(http.ListenAndServe(":3000", handlerWithCORS))
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Разрешаем доступ со всех источников или ограничьте конкретным
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization") // Разрешаем заголовки, включая Authorization
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
