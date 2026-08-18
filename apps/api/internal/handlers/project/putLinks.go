package project

import (
	"net/http"

	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PutLinks(w http.ResponseWriter, r *http.Request) {
	projectID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}

	var request projectReq.PutLinks

	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
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
		if utils.IsForeignKeyViolation(err) {
			http.Error(w, "project not found", http.StatusNotFound)
			return
		}
		http.Error(
			w,
			"failed to save project links",
			http.StatusInternalServerError,
		)
		return
	}

	response := projectResp.ToProjectLinksResponse(links)

	utils.WriteJSON(w, http.StatusOK, response)
}
