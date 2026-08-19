package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/storage"
)

const defaultGraceHours = 24

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}
	graceHours := defaultGraceHours
	if value := os.Getenv("UPLOAD_CLEANUP_GRACE_HOURS"); value != "" {
		parsed, err := strconv.Atoi(value)
		if err != nil || parsed < 1 {
			return fmt.Errorf("UPLOAD_CLEANUP_GRACE_HOURS must be a positive integer")
		}
		graceHours = parsed
	}

	postgres, err := storage.NewPostgres(databaseURL)
	if err != nil {
		return fmt.Errorf("connect to database: %w", err)
	}
	defer postgres.DB.Close()

	result, err := storage.CleanupOrphanedUploads(
		context.Background(), postgres.DB, "./uploads",
		time.Now().Add(-time.Duration(graceHours)*time.Hour),
	)
	if err != nil {
		return fmt.Errorf("clean uploads: %w", err)
	}
	log.Printf("upload cleanup complete: scanned=%d retained=%d removed=%d", result.Scanned, result.Retained, result.Removed)
	return nil
}
