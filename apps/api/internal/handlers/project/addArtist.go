package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
)

func (h Handler) AddArtist(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	var request struct {
		ArtistID int64 `json:"artist_id"`
	}

	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}

	if request.ArtistID <= 0 || request.ArtistID > 2147483647 {
		http.Error(w, "artist_id must be a positive 32-bit integer", http.StatusBadRequest)
		return
	}

	err := h.projectRepo.AddArtist(
		r.Context(),
		projectID,
		request.ArtistID,
	)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project or artist not found", "failed to link artist to project")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
