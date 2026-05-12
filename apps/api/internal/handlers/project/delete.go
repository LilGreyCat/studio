package project

import (
	"database/sql"
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/storage"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Delete(w http.ResponseWriter, r *http.Request) {
	projectID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}

	project, err := h.projectRepo.GetByID(r.Context(), projectID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "project not found", http.StatusNotFound)
			return
		}

		http.Error(w, "failed to fetch project", http.StatusInternalServerError)
		return
	}

	err = h.projectRepo.Delete(r.Context(), projectID)
	if err != nil {
		http.Error(w, "failed to delete project", http.StatusInternalServerError)
		return
	}

	if project.ImageURL.Valid {
		_ = storage.DeleteUploadedFile(project.ImageURL.String)
	}

	w.WriteHeader(http.StatusNoContent)
}
