package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Patch(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}

	var request artistReq.PatchArtist

	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}

	if request.Name.Set && request.Name.Value == nil {
		http.Error(w, "name cannot be null", http.StatusBadRequest)
		return
	}
	if !request.Name.Set && !request.ImageURL.Set {
		http.Error(w, "at least one field is required", http.StatusBadRequest)
		return
	}
	if request.Name.Value != nil {
		name, err := utils.NormalizeEntityName(*request.Name.Value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		request.Name.Value = &name
	}

	artist, err := h.artistRepo.Update(
		r.Context(),
		artistID,
		request.Name.Set,
		request.Name.Value,
		request.ImageURL.Set,
		request.ImageURL.Value,
	)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist not found", "failed to update artist")
		return
	}

	response := artistResp.ToArtistResponse(artist)
	utils.WriteJSON(w, http.StatusOK, response)
}
