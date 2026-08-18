package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutLinks(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	var request projectReq.PutLinks

	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := utils.NormalizeHTTPURLs(&request.SpotifyURL, &request.DeezerURL, &request.AppleMusicURL, &request.SoundcloudURL, &request.YoutubeURL); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	links, err := h.projectRepo.PutLinks(
		r.Context(),
		projectID,
		request.SpotifyURL,
		request.DeezerURL,
		request.AppleMusicURL,
		request.SoundcloudURL,
		request.YoutubeURL,
	)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project not found", "failed to save project links")
		return
	}

	response := projectResp.ToProjectLinksResponse(links)

	utils.WriteJSON(w, http.StatusOK, response)
}
