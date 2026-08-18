package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}

	artist, err := h.artistRepo.GetByID(r.Context(), artistID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist not found", "failed to fetch artist")
		return
	}

	response := artistResp.ToArtistResponse(artist)
	utils.WriteJSON(w, http.StatusOK, response)
}
