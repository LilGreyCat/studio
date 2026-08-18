package hardware

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDeleteOldImageIfChangedOnlyDeletesReplacedUpload(t *testing.T) {
	root := t.TempDir()
	previousDirectory, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(root); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.Chdir(previousDirectory) })

	uploadPath := filepath.Join(root, "uploads", "hardware", "old.webp")
	if err := os.MkdirAll(filepath.Dir(uploadPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(uploadPath, []byte("image"), 0o600); err != nil {
		t.Fatal(err)
	}

	deleteOldImageIfChanged("/uploads/hardware/old.webp", "/uploads/hardware/new.webp")
	if _, err := os.Stat(uploadPath); !os.IsNotExist(err) {
		t.Fatalf("replaced upload still exists: %v", err)
	}

	deleteOldImageIfChanged("/matos/mic1.jpg", "/uploads/hardware/new.webp")
}
