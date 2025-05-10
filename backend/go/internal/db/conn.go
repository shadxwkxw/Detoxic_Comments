package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func Init() error {
	// Загружаем .env
	if err := godotenv.Load(); err != nil {
		return fmt.Errorf("failed to load .env file: %w", err)
	}

	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	connStr := fmt.Sprintf("port=%s user=%s password=%s dbname=%s sslmode=disable", port, user, password, name)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open DB: %w", err)
	}

	if err := DB.Ping(); err != nil {
		return fmt.Errorf("failed to connect to DB: %w", err)
	}

	log.Println("Connected to DB")
	return nil
}

func GetDB() (*sql.DB, error) {
	if DB == nil {
		return nil, fmt.Errorf("database not initialized")
	}
	return DB, nil
}

func Migrate() error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            login VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );`,
		`CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            text_comment TEXT NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            corrected_ai BOOLEAN DEFAULT false,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
	}

	for _, query := range queries {
		_, err := DB.Exec(query)
		if err != nil {
			return fmt.Errorf("migration error: %w", err)
		}
	}

	log.Println("Database migration completed.")
	return nil
}
