package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) PatchLinks(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}
	var request projectReq.PatchLinks
	if !httpapi.DecodeJSON(w, r, &request) {
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
		httpapi.WriteRepositoryError(w, err, "project links not found", "failed to patch project links")
		return
	}
	utils.WriteJSON(w, http.StatusOK, projectResp.ToProjectLinksResponse(links))
}
