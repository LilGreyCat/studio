package artist

import (
	"database/sql"
	"errors"
	"net/http"

	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchLinks(w http.ResponseWriter, r *http.Request) {
	artistID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid artist id", http.StatusBadRequest)
		return
	}
	var request artistReq.PatchLinks
	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	links, err := h.artistRepo.PatchLinks(r.Context(), artistID, request)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "artist links not found", http.StatusNotFound)
			return
		}
		http.Error(w, "failed to patch artist links", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, artistResp.ToArtistLinksResponse(links))
}
