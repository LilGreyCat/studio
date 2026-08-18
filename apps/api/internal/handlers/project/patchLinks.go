package project

import (
	"database/sql"
	"errors"
	"net/http"

	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchLinks(w http.ResponseWriter, r *http.Request) {
	projectID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}
	var request projectReq.PatchLinks
	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	fields := []*utils.Optional[string]{&request.SpotifyURL, &request.DeezerURL, &request.AppleMusicURL, &request.SoundcloudURL, &request.YoutubeURL}
	if !utils.AnyOptionalSet(fields...) {
		http.Error(w, "at least one field is required", http.StatusBadRequest)
		return
	}
	if err := utils.NormalizeOptionalHTTPURLs(fields...); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	links, err := h.projectRepo.PatchLinks(r.Context(), projectID, request)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "project links not found", http.StatusNotFound)
			return
		}
		http.Error(w, "failed to patch project links", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, projectResp.ToProjectLinksResponse(links))
}
