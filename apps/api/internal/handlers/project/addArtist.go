package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) AddArtist(w http.ResponseWriter, r *http.Request) {
	projectID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}

	var request struct {
		ArtistID int64 `json:"artist_id"`
	}

	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if request.ArtistID <= 0 || request.ArtistID > 2147483647 {
		http.Error(w, "artist_id must be a positive 32-bit integer", http.StatusBadRequest)
		return
	}

	err = h.projectRepo.AddArtist(
		r.Context(),
		projectID,
		request.ArtistID,
	)
	if err != nil {
		if utils.IsForeignKeyViolation(err) {
			http.Error(w, "project or artist not found", http.StatusNotFound)
			return
		}
		http.Error(
			w,
			"failed to link artist to project",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
