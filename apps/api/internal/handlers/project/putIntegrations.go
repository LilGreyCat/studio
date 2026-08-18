package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutIntegrations(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	var request projectReq.PutIntegrations

	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := utils.NormalizeEmbedURLs(&request.SpotifyEmbedURL, &request.DeezerEmbedURL, &request.AppleMusicEmbedURL); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	integrations, err := h.projectRepo.PutIntegrations(
		r.Context(),
		projectID,
		request.SpotifyEmbedURL,
		request.DeezerEmbedURL,
		request.AppleMusicEmbedURL,
	)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project not found", "failed to save project integrations")
		return
	}

	response := projectResp.ToProjectIntegrationsResponse(integrations)

	utils.WriteJSON(w, http.StatusOK, response)
}
