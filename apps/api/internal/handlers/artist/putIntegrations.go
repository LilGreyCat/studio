package artist

import (
	"net/http"

	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutIntegrations(w http.ResponseWriter, r *http.Request) {
	artistID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid artist id", http.StatusBadRequest)
		return
	}

	var request artistReq.PutIntegrations

	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
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
		if utils.IsForeignKeyViolation(err) {
			http.Error(w, "artist not found", http.StatusNotFound)
			return
		}
		http.Error(
			w,
			"failed to save artist integrations",
			http.StatusInternalServerError,
		)
		return
	}

	response := artistResp.ToArtistIntegrationsResponse(integrations)
	utils.WriteJSON(w, http.StatusOK, response)
}
