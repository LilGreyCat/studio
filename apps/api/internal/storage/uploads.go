package storage

import (
	"os"
	"path/filepath"
	"strings"
)

func DeleteUploadedFile(publicURL string) error {
	if publicURL == "" {
		return nil
	}

	if !strings.HasPrefix(publicURL, "/uploads/") {
		return nil
	}

	relativePath := strings.TrimPrefix(publicURL, "/uploads/")
	filePath := filepath.Join("./uploads", relativePath)

	cleanUploadsDir, err := filepath.Abs("./uploads")
	if err != nil {
		return err
	}

	cleanFilePath, err := filepath.Abs(filePath)
	if err != nil {
		return err
	}

	if !strings.HasPrefix(cleanFilePath, cleanUploadsDir) {
		return nil
	}

	err = os.Remove(cleanFilePath)
	if os.IsNotExist(err) {
		return nil
	}

	return err
}
