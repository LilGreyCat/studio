package uploads

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

func saveUploadedFile(
	file multipart.File,
	folder string,
	ext string,
) (string, error) {
	uploadDir := filepath.Join("./uploads", folder)
	if err := os.MkdirAll(uploadDir, 0o755); err != nil {
		return "", err
	}

	randomName := make([]byte, 16)
	if _, err := rand.Read(randomName); err != nil {
		return "", err
	}
	filename := fmt.Sprintf("%s%s", hex.EncodeToString(randomName), ext)
	dstPath := filepath.Join(uploadDir, filename)

	dst, err := os.OpenFile(dstPath, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
	if err != nil {
		return "", err
	}
	completed := false
	defer func() {
		_ = dst.Close()
		if !completed {
			_ = os.Remove(dstPath)
		}
	}()

	if _, err := io.Copy(dst, file); err != nil {
		return "", err
	}
	if err := dst.Close(); err != nil {
		return "", err
	}

	completed = true
	return filename, nil
}
