package project

import (
	"database/sql"

	"github.com/PtiCadri/studio/apps/api/internal/storage"
)

func deleteOldProjectImageIfChanged(
	oldImage sql.NullString,
	newImage sql.NullString,
) {
	if !oldImage.Valid {
		return
	}

	if newImage.Valid && oldImage.String == newImage.String {
		return
	}

	_ = storage.DeleteUploadedFile(oldImage.String)
}
