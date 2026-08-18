package routes

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestUploadFileHandlerServesSupportedImages(t *testing.T) {
	root := t.TempDir()
	imagePath := filepath.Join(root, "projects", "cover.webp")
	if err := os.MkdirAll(filepath.Dir(imagePath), 0o755); err != nil {
		t.Fatalf("MkdirAll() error = %v", err)
	}
	if err := os.WriteFile(imagePath, []byte("image"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	handler := uploadFileHandler(http.FileServer(http.Dir(root)))
	response := httptest.NewRecorder()
	handler.ServeHTTP(
		response,
		httptest.NewRequest(http.MethodGet, "/projects/cover.webp", nil),
	)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}
	if response.Body.String() != "image" {
		t.Fatalf("body = %q, want image content", response.Body.String())
	}
}

func TestUploadFileHandlerDoesNotListDirectories(t *testing.T) {
	root := t.TempDir()
	imagePath := filepath.Join(root, "projects", "private-name.webp")
	if err := os.MkdirAll(filepath.Dir(imagePath), 0o755); err != nil {
		t.Fatalf("MkdirAll() error = %v", err)
	}
	if err := os.WriteFile(imagePath, []byte("image"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	handler := uploadFileHandler(http.FileServer(http.Dir(root)))
	response := httptest.NewRecorder()
	handler.ServeHTTP(
		response,
		httptest.NewRequest(http.MethodGet, "/projects/", nil),
	)

	if response.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusNotFound)
	}
	if strings.Contains(response.Body.String(), "private-name.webp") {
		t.Fatal("directory response exposed an uploaded filename")
	}
}

func TestUploadFileHandlerRejectsUnsupportedFiles(t *testing.T) {
	root := t.TempDir()
	textPath := filepath.Join(root, "projects", "notes.txt")
	if err := os.MkdirAll(filepath.Dir(textPath), 0o755); err != nil {
		t.Fatalf("MkdirAll() error = %v", err)
	}
	if err := os.WriteFile(textPath, []byte("secret"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	handler := uploadFileHandler(http.FileServer(http.Dir(root)))
	response := httptest.NewRecorder()
	handler.ServeHTTP(
		response,
		httptest.NewRequest(http.MethodGet, "/projects/notes.txt", nil),
	)

	if response.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusNotFound)
	}
}
