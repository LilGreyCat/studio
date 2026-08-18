package uploads

import (
	"os"
	"testing"
)

func TestValidateFileMimeTypeRequiresMatchingExtension(t *testing.T) {
	file, err := os.CreateTemp(t.TempDir(), "upload-*")
	if err != nil {
		t.Fatalf("CreateTemp() error = %v", err)
	}
	defer file.Close()

	pngHeader := []byte{0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a}
	if _, err := file.Write(pngHeader); err != nil {
		t.Fatalf("Write() error = %v", err)
	}
	if _, err := file.Seek(0, 0); err != nil {
		t.Fatalf("Seek() error = %v", err)
	}

	if err := validateFileMimeType(file, ".png"); err != nil {
		t.Fatalf("matching PNG was rejected: %v", err)
	}
	if err := validateFileMimeType(file, ".jpg"); err == nil {
		t.Fatal("PNG content with a JPEG extension was accepted")
	}
}

func TestValidateFolderAcceptsHardware(t *testing.T) {
	if err := validateFolder("hardware"); err != nil {
		t.Fatalf("hardware folder was rejected: %v", err)
	}
	if err := validateFolder("../hardware"); err == nil {
		t.Fatal("unsafe folder was accepted")
	}
}
