package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Init() error {
	var err error
	DB, err = sql.Open("postgres", "port=7000 user=postgres password=6922813371488 dbname=myappdb sslmode=disable")
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
            corrected_ai BOOLEAN DEFAULT false
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
