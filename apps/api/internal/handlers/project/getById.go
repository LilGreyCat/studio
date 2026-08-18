package project

import (
	"database/sql"
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/utils"

	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
)

func (h Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ParseIDParam(r, "id")

	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}

	project, artists, err := h.projectRepo.GetDetail(r.Context(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "project not found", http.StatusNotFound)
			return
		}

		http.Error(w, "failed to fetch project", http.StatusInternalServerError)
		return
	}

	response := projectResp.ToProjectDetailResponse(project, artists)
	utils.WriteJSON(w, http.StatusOK, response)
}
