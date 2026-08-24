package project

import (
	"database/sql"
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func normalizeFullProjectURLs(links *projectReq.PutLinks, integrations *projectReq.PutIntegrations) error {
	if err := utils.NormalizeHTTPURLs(&links.SpotifyURL, &links.DeezerURL,
		&links.AppleMusicURL, &links.SoundcloudURL, &links.YoutubeURL); err != nil {
		return err
	}
	return utils.NormalizeEmbedURLs(&integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL, &integrations.AppleMusicEmbedURL)
}

func (h Handler) CreateFull(w http.ResponseWriter, r *http.Request) {
	var request projectReq.CreateFullProject
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}

	name, err := utils.NormalizeEntityName(request.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	request.Name = name
	if err := normalizeFullProjectURLs(&request.Links, &request.Integrations); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	project, err := h.projectRepo.CreateFull(r.Context(), request)
	if err != nil {
		http.Error(w, "failed to create project", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, projectResp.ToProjectResponse(project))
}

func (h Handler) UpdateFull(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}
	var request projectReq.UpdateFullProject
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if request.Project.Name.Set && request.Project.Name.Value == nil {
		http.Error(w, "name cannot be null", http.StatusBadRequest)
		return
	}
	if !request.Project.Name.Set && !request.Project.ImageURL.Set &&
		!request.Project.DisplayOrder.Set && !request.Project.IsVisible.Set && !request.Project.IsFeatured.Set {
		http.Error(w, "at least one project field is required", http.StatusBadRequest)
		return
	}
	if request.Project.Name.Value != nil {
		name, err := utils.NormalizeEntityName(*request.Project.Name.Value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		request.Project.Name.Value = &name
	}
	if request.Project.DisplayOrder.Set && (request.Project.DisplayOrder.Value == nil || *request.Project.DisplayOrder.Value < 0) {
		http.Error(w, "display_order must be zero or greater", http.StatusBadRequest)
		return
	}
	if request.Project.IsVisible.Set && request.Project.IsVisible.Value == nil {
		http.Error(w, "is_visible cannot be null", http.StatusBadRequest)
		return
	}
	if request.Project.IsFeatured.Set && request.Project.IsFeatured.Value == nil {
		http.Error(w, "is_featured cannot be null", http.StatusBadRequest)
		return
	}
	if err := normalizeFullProjectURLs(&request.Links, &request.Integrations); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	project, previousImageURL, err := h.projectRepo.UpdateFull(r.Context(), id, request)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project not found", "failed to update project")
		return
	}
	if previousImageURL != nil {
		deleteOldProjectImageIfChanged(sql.NullString{String: *previousImageURL, Valid: true}, project.ImageURL)
	}
	utils.WriteJSON(w, http.StatusOK, projectResp.ToProjectResponse(project))
}
