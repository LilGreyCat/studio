package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	"github.com/PtiCadri/studio/apps/api/internal/storage"
)

func (h Handler) Delete(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}

	artist, err := h.artistRepo.Delete(r.Context(), artistID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist not found", "failed to delete artist")
		return
	}
	if artist.ImageURL.Valid {
		_ = storage.DeleteUploadedFile(artist.ImageURL.String)
	}

	w.WriteHeader(http.StatusNoContent)
}
