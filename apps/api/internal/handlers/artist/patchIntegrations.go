package artist

import (
	"database/sql"
	"errors"
	"net/http"

	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchIntegrations(w http.ResponseWriter, r *http.Request) {
	artistID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid artist id", http.StatusBadRequest)
		return
	}
	var request artistReq.PatchIntegrations
	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	integrations, err := h.artistRepo.PatchIntegrations(r.Context(), artistID, request)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "artist integrations not found", http.StatusNotFound)
			return
		}
		http.Error(w, "failed to patch artist integrations", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, artistResp.ToArtistIntegrationsResponse(integrations))
}
