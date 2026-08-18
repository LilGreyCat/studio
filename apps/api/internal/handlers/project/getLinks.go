package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) GetLinks(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	links, err := h.projectRepo.GetLinks(r.Context(), projectID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project links not found", "failed to fetch project links")
		return
	}

	response := projectResp.ToProjectLinksResponse(links)

	utils.WriteJSON(w, http.StatusOK, response)
}
