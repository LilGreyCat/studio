package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutLinks(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}

	var request artistReq.PutLinks

	if !httpapi.DecodeJSON(w, r, &request) {
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
		httpapi.WriteRepositoryError(w, err, "artist not found", "failed to save artist links")
		return
	}

	response := artistResp.ToArtistLinksResponse(links)
	utils.WriteJSON(w, http.StatusOK, response)
}
