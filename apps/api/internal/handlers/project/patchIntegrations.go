package project

import (
	"database/sql"
	"errors"
	"net/http"

	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchIntegrations(w http.ResponseWriter, r *http.Request) {
	projectID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}
	var request projectReq.PatchIntegrations
	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	integrations, err := h.projectRepo.PatchIntegrations(r.Context(), projectID, request)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "project integrations not found", http.StatusNotFound)
			return
		}
		http.Error(w, "failed to patch project integrations", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, projectResp.ToProjectIntegrationsResponse(integrations))
}
