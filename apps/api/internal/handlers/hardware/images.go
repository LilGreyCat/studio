package hardware

import "github.com/PtiCadri/studio/apps/api/internal/storage"

func deleteOldImageIfChanged(previousImageURL, currentImageURL string) {
	if previousImageURL == "" || previousImageURL == currentImageURL {
		return
	}
	_ = storage.DeleteUploadedFile(previousImageURL)
}
