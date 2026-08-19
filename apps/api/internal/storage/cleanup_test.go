package storage

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestCleanupOrphanedUploadsPreservesReferencedAndRecentFiles(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	mock.ExpectQuery("SELECT image_url FROM artists").WillReturnRows(
		sqlmock.NewRows([]string{"image_url"}).AddRow("/uploads/projects/used.webp"),
	)

	root := t.TempDir()
	directory := filepath.Join(root, "projects")
	if err := os.MkdirAll(directory, 0o755); err != nil {
		t.Fatal(err)
	}
	old := time.Now().Add(-48 * time.Hour)
	writeUpload := func(name string, modified time.Time) string {
		t.Helper()
		path := filepath.Join(directory, name)
		if err := os.WriteFile(path, []byte("image"), 0o600); err != nil {
			t.Fatal(err)
		}
		if err := os.Chtimes(path, modified, modified); err != nil {
			t.Fatal(err)
		}
		return path
	}
	used := writeUpload("used.webp", old)
	orphan := writeUpload("orphan.webp", old)
	recent := writeUpload("recent.webp", time.Now())

	result, err := CleanupOrphanedUploads(context.Background(), db, root, time.Now().Add(-24*time.Hour))
	if err != nil {
		t.Fatal(err)
	}
	if result.Scanned != 3 || result.Removed != 1 || result.Retained != 2 {
		t.Fatalf("unexpected cleanup result: %+v", result)
	}
	if _, err := os.Stat(orphan); !os.IsNotExist(err) {
		t.Fatal("old orphan was not removed")
	}
	for _, path := range []string{used, recent} {
		if _, err := os.Stat(path); err != nil {
			t.Fatalf("retained file missing: %v", err)
		}
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
