package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) GetLinks(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}

	links, err := h.artistRepo.GetLinks(r.Context(), artistID)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist links not found", "failed to fetch artist links")
		return
	}

	response := artistResp.ToArtistLinksResponse(links)
	utils.WriteJSON(w, http.StatusOK, response)
}
