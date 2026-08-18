package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchIntegrations(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}
	var request projectReq.PatchIntegrations
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	fields := []*utils.Optional[string]{&request.SpotifyEmbedURL, &request.DeezerEmbedURL, &request.AppleMusicEmbedURL}
	if !utils.AnyOptionalSet(fields...) {
		http.Error(w, "at least one field is required", http.StatusBadRequest)
		return
	}
	if err := utils.NormalizeOptionalEmbedURLs(fields...); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	integrations, err := h.projectRepo.PatchIntegrations(r.Context(), projectID, request)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project integrations not found", "failed to patch project integrations")
		return
	}
	utils.WriteJSON(w, http.StatusOK, projectResp.ToProjectIntegrationsResponse(integrations))
}
