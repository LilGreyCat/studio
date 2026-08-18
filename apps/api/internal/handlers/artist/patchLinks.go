package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchLinks(w http.ResponseWriter, r *http.Request) {
	artistID, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}
	var request artistReq.PatchLinks
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	fields := []*utils.Optional[string]{&request.SpotifyURL, &request.DeezerURL, &request.AppleMusicURL, &request.SoundcloudURL, &request.YoutubeURL, &request.InstagramURL, &request.TiktokURL}
	if !utils.AnyOptionalSet(fields...) {
		http.Error(w, "at least one field is required", http.StatusBadRequest)
		return
	}
	if err := utils.NormalizeOptionalHTTPURLs(fields...); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	links, err := h.artistRepo.PatchLinks(r.Context(), artistID, request)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist links not found", "failed to patch artist links")
		return
	}
	utils.WriteJSON(w, http.StatusOK, artistResp.ToArtistLinksResponse(links))
}
