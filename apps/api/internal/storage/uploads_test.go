package storage

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDeleteUploadedFileRejectsTraversalIntoSiblingDirectory(t *testing.T) {
	root := t.TempDir()
	previousDirectory, err := os.Getwd()
	if err != nil {
		t.Fatalf("Getwd() error = %v", err)
	}
	if err := os.Chdir(root); err != nil {
		t.Fatalf("Chdir() error = %v", err)
	}
	t.Cleanup(func() {
		if err := os.Chdir(previousDirectory); err != nil {
			t.Errorf("restore working directory: %v", err)
		}
	})

	siblingDirectory := filepath.Join(root, "uploads-evil")
	if err := os.Mkdir(siblingDirectory, 0o755); err != nil {
		t.Fatalf("Mkdir() error = %v", err)
	}
	target := filepath.Join(siblingDirectory, "keep.txt")
	if err := os.WriteFile(target, []byte("keep"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	if err := DeleteUploadedFile("/uploads/../uploads-evil/keep.txt"); err != nil {
		t.Fatalf("DeleteUploadedFile() error = %v", err)
	}
	if _, err := os.Stat(target); err != nil {
		t.Fatalf("file outside uploads was modified: %v", err)
	}
}

func TestDeleteUploadedFileDeletesFileInsideUploadDirectory(t *testing.T) {
	root := t.TempDir()
	previousDirectory, err := os.Getwd()
	if err != nil {
		t.Fatalf("Getwd() error = %v", err)
	}
	if err := os.Chdir(root); err != nil {
		t.Fatalf("Chdir() error = %v", err)
	}
	t.Cleanup(func() {
		if err := os.Chdir(previousDirectory); err != nil {
			t.Errorf("restore working directory: %v", err)
		}
	})

	uploadDirectory := filepath.Join(root, "uploads", "projects")
	if err := os.MkdirAll(uploadDirectory, 0o755); err != nil {
		t.Fatalf("MkdirAll() error = %v", err)
	}
	target := filepath.Join(uploadDirectory, "delete.webp")
	if err := os.WriteFile(target, []byte("image"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	if err := DeleteUploadedFile("/uploads/projects/delete.webp"); err != nil {
		t.Fatalf("DeleteUploadedFile() error = %v", err)
	}
	if _, err := os.Stat(target); !os.IsNotExist(err) {
		t.Fatalf("uploaded file still exists, stat error = %v", err)
	}
}
