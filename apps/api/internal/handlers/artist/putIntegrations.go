package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutIntegrations(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}

	var request artistReq.PutIntegrations

	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := utils.NormalizeEmbedURLs(&request.SpotifyEmbedURL, &request.DeezerEmbedURL, &request.AppleMusicEmbedURL); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	integrations, err := h.artistRepo.PutIntegrations(
		r.Context(),
		artistID,
		request.SpotifyEmbedURL,
		request.DeezerEmbedURL,
		request.AppleMusicEmbedURL,
	)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist not found", "failed to save artist integrations")
		return
	}

	response := artistResp.ToArtistIntegrationsResponse(integrations)
	utils.WriteJSON(w, http.StatusOK, response)
}
