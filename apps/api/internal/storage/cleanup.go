package storage

import (
	"context"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/repository"
)

type CleanupResult struct {
	Scanned  int
	Removed  int
	Retained int
}

var managedUploadFolders = map[string]bool{
	"artists": true, "hardware": true, "projects": true,
}

var managedUploadExtensions = map[string]bool{
	".jpg": true, ".jpeg": true, ".png": true, ".webp": true,
}

func CleanupOrphanedUploads(
	ctx context.Context,
	db repository.Database,
	root string,
	olderThan time.Time,
) (CleanupResult, error) {
	references, err := referencedUploadURLs(ctx, db)
	if err != nil {
		return CleanupResult{}, err
	}

	result := CleanupResult{}
	err = filepath.WalkDir(root, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			return nil
		}
		if entry.Type()&os.ModeSymlink != 0 {
			return nil
		}

		relative, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		parts := strings.Split(filepath.ToSlash(relative), "/")
		if len(parts) != 2 || !managedUploadFolders[parts[0]] ||
			!managedUploadExtensions[strings.ToLower(filepath.Ext(parts[1]))] {
			return nil
		}

		result.Scanned++
		publicURL := "/uploads/" + strings.Join(parts, "/")
		if references[publicURL] {
			result.Retained++
			return nil
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		if !info.ModTime().Before(olderThan) {
			result.Retained++
			return nil
		}
		if err := os.Remove(path); err != nil {
			return fmt.Errorf("remove orphan %s: %w", publicURL, err)
		}
		result.Removed++
		return nil
	})
	return result, err
}

func referencedUploadURLs(ctx context.Context, db repository.Database) (map[string]bool, error) {
	const query = `
		SELECT image_url FROM artists WHERE image_url LIKE '/uploads/%'
		UNION
		SELECT image_url FROM projects WHERE image_url LIKE '/uploads/%'
		UNION
		SELECT image_url FROM hardware_items WHERE image_url LIKE '/uploads/%';
	`
	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	references := make(map[string]bool)
	for rows.Next() {
		var value string
		if err := rows.Scan(&value); err != nil {
			return nil, err
		}
		references[value] = true
	}
	return references, rows.Err()
}
