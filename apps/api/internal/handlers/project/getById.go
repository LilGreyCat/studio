package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	"github.com/PtiCadri/studio/apps/api/internal/utils"

	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
)

func (h Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	project, artists, err := h.projectRepo.GetDetail(r.Context(), id)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project not found", "failed to fetch project")
		return
	}

	response := projectResp.ToProjectDetailResponse(project, artists)
	utils.WriteJSON(w, http.StatusOK, response)
}
