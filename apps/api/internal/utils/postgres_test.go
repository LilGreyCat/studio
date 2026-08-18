package utils

import (
	"fmt"
	"testing"

	"github.com/jackc/pgx/v5/pgconn"
)

func TestPostgresErrorClassification(t *testing.T) {
	foreignKeyError := fmt.Errorf("wrapped: %w", &pgconn.PgError{Code: "23503"})
	uniqueError := &pgconn.PgError{Code: "23505"}

	if !IsForeignKeyViolation(foreignKeyError) {
		t.Error("wrapped foreign-key violation was not recognized")
	}
	if IsForeignKeyViolation(uniqueError) {
		t.Error("unique violation was classified as a foreign-key violation")
	}
	if !IsUniqueViolation(uniqueError) {
		t.Error("unique violation was not recognized")
	}
	if IsUniqueViolation(foreignKeyError) {
		t.Error("foreign-key violation was classified as a unique violation")
	}
}
