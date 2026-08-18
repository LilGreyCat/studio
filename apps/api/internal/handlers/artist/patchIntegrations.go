package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchIntegrations(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}
	var request artistReq.PatchIntegrations
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
	integrations, err := h.artistRepo.PatchIntegrations(r.Context(), artistID, request)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist integrations not found", "failed to patch artist integrations")
		return
	}
	utils.WriteJSON(w, http.StatusOK, artistResp.ToArtistIntegrationsResponse(integrations))
}
