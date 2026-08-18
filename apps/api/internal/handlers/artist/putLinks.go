package artist

import (
	"net/http"

	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutLinks(w http.ResponseWriter, r *http.Request) {
	artistID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid artist id", http.StatusBadRequest)
		return
	}

	var request artistReq.PutLinks

	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if err := utils.NormalizeHTTPURLs(&request.SpotifyURL, &request.DeezerURL, &request.AppleMusicURL, &request.SoundcloudURL, &request.YoutubeURL, &request.InstagramURL, &request.TiktokURL); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	links, err := h.artistRepo.PutLinks(
		r.Context(),
		artistID,
		request.SpotifyURL,
		request.DeezerURL,
		request.AppleMusicURL,
		request.SoundcloudURL,
		request.YoutubeURL,
		request.InstagramURL,
		request.TiktokURL,
	)
	if err != nil {
		if utils.IsForeignKeyViolation(err) {
			http.Error(w, "artist not found", http.StatusNotFound)
			return
		}
		http.Error(
			w,
			"failed to save artist links",
			http.StatusInternalServerError,
		)
		return
	}

	response := artistResp.ToArtistLinksResponse(links)
	utils.WriteJSON(w, http.StatusOK, response)
}
