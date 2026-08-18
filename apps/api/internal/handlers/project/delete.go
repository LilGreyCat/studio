package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	"github.com/PtiCadri/studio/apps/api/internal/storage"
)

func (h Handler) Delete(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	project, err := h.projectRepo.Delete(r.Context(), projectID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project not found", "failed to delete project")
		return
	}

	if project.ImageURL.Valid {
		_ = storage.DeleteUploadedFile(project.ImageURL.String)
	}

	w.WriteHeader(http.StatusNoContent)
}
