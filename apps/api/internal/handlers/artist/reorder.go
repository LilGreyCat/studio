package artist

import (
	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
	"net/http"
)

func (h Handler) Reorder(w http.ResponseWriter, r *http.Request) {
	var request artistReq.Reorder
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if len(request.IDs) == 0 || len(request.IDs) > 32767 {
		http.Error(w, "ids must contain every artist", http.StatusBadRequest)
		return
	}
	seen := map[int64]bool{}
	for _, id := range request.IDs {
		if id <= 0 || seen[id] {
			http.Error(w, "ids must contain unique positive identifiers", http.StatusBadRequest)
			return
		}
		seen[id] = true
	}
	artists, err := h.artistRepo.Reorder(r.Context(), request.IDs)
	if err != nil {
		http.Error(w, "failed to reorder artists", http.StatusInternalServerError)
		return
	}
	if len(artists) != len(request.IDs) {
		http.Error(w, "ids must contain every artist", http.StatusBadRequest)
		return
	}
	utils.WriteJSON(w, http.StatusOK, artistResp.ToArtistResponses(artists))
}
