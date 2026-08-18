package project

import (
	"net/http"

	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutIntegrations(w http.ResponseWriter, r *http.Request) {
	projectID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}

	var request projectReq.PutIntegrations

	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
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
		if utils.IsForeignKeyViolation(err) {
			http.Error(w, "project not found", http.StatusNotFound)
			return
		}
		http.Error(
			w,
			"failed to save project integrations",
			http.StatusInternalServerError,
		)
		return
	}

	response := projectResp.ToProjectIntegrationsResponse(integrations)

	utils.WriteJSON(w, http.StatusOK, response)
}
