package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) GetIntegrations(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}

	integrations, err := h.artistRepo.GetIntegrations(r.Context(), artistID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist integrations not found", "failed to fetch artist integrations")
		return
	}

	response := artistResp.ToArtistIntegrationsResponse(integrations)
	utils.WriteJSON(w, http.StatusOK, response)
}
