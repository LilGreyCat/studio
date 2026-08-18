package uploads

import (
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"
)

var allowedFolders = map[string]bool{
	"artists":  true,
	"hardware": true,
	"projects": true,
}

var allowedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".webp": true,
}

var allowedMimeExtensions = map[string]map[string]bool{
	"image/jpeg": {".jpg": true, ".jpeg": true},
	"image/png":  {".png": true},
	"image/webp": {".webp": true},
}

func validateFolder(folder string) error {
	if folder == "" {
		return errors.New("folder is required")
	}

	if !allowedFolders[folder] {
		return errors.New("invalid folder")
	}

	return nil
}

func validateFileExtension(filename string) (string, error) {
	ext := strings.ToLower(filepath.Ext(filename))
	if ext == "" {
		return "", errors.New("file extension is required")
	}

	if !allowedExtensions[ext] {
		return "", errors.New("unsupported file extension")
	}

	return ext, nil
}

func validateFileMimeType(file multipart.File, extension string) error {
	buffer := make([]byte, 512)

	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return errors.New("failed to read file")
	}

	mimeType := http.DetectContentType(buffer[:n])
	allowedExtensions, supported := allowedMimeExtensions[mimeType]
	if !supported {
		return errors.New("unsupported file type")
	}
	if !allowedExtensions[extension] {
		return errors.New("file extension does not match file type")
	}

	_, err = file.Seek(0, 0)
	if err != nil {
		return errors.New("failed to reset file reader")
	}

	return nil
}
