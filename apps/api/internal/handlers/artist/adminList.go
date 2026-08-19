package artist

import (
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
	"net/http"
)

func (h Handler) AdminList(w http.ResponseWriter, r *http.Request) {
	artists, err := h.artistRepo.ListAll(r.Context())
	if err != nil {
		http.Error(w, "failed to fetch artists", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, artistResp.ToArtistResponses(artists))
}
