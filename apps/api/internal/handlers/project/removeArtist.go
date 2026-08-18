package project

import (
	"net/http"
	"strconv"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	"github.com/go-chi/chi/v5"
)

func (h Handler) RemoveArtist(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	artistIDStr := chi.URLParam(r, "artistId")
	artistID, err := strconv.ParseInt(artistIDStr, 10, 32)
	if err != nil || artistID <= 0 {
		http.Error(w, "invalid artist id", http.StatusBadRequest)
		return
	}

	err = h.projectRepo.RemoveArtist(r.Context(), projectID, artistID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist-project link not found", "failed to unlink artist from project")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
