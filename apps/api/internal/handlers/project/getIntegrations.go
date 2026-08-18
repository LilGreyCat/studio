package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) GetIntegrations(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	integrations, err := h.projectRepo.GetIntegrations(r.Context(), projectID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project integrations not found", "failed to fetch project integrations")
		return
	}

	response := projectResp.ToProjectIntegrationsResponse(integrations)

	utils.WriteJSON(w, http.StatusOK, response)
}
