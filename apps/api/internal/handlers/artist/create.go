package artist

import (
	"net/http"

	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Create(w http.ResponseWriter, r *http.Request) {
	var request artistReq.CreateArtist

	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	name, err := utils.NormalizeEntityName(request.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	artist, err := h.artistRepo.Create(
		r.Context(),
		name,
		request.ImageURL,
	)
	if err != nil {
		http.Error(
			w,
			"failed to create artist",
			http.StatusInternalServerError,
		)
		return
	}

	response := artistResp.ToArtistResponse(artist)
	utils.WriteJSON(w, http.StatusCreated, response)
}
