package project

import (
	"database/sql"
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Patch(w http.ResponseWriter, r *http.Request) {
	projectID, ok := httpapi.ParseID(w, r, "id", "project")
	if !ok {
		return
	}

	var request projectReq.PatchProject
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}

	if request.Name.Set && request.Name.Value == nil {
		http.Error(w, "name cannot be null", http.StatusBadRequest)
		return
	}
	if !request.Name.Set && !request.ImageURL.Set && !request.DisplayOrder.Set && !request.IsVisible.Set && !request.IsFeatured.Set {
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
	if request.DisplayOrder.Set && (request.DisplayOrder.Value == nil || *request.DisplayOrder.Value < 0) {
		http.Error(w, "display_order must be zero or greater", http.StatusBadRequest)
		return
	}
	if request.IsVisible.Set && request.IsVisible.Value == nil {
		http.Error(w, "is_visible cannot be null", http.StatusBadRequest)
		return
	}
	if request.IsFeatured.Set && request.IsFeatured.Value == nil {
		http.Error(w, "is_featured cannot be null", http.StatusBadRequest)
		return
	}

	project, previousImageURL, err := h.projectRepo.Update(
		r.Context(),
		projectID,
		request.Name.Set,
		request.Name.Value,
		request.ImageURL.Set,
		request.ImageURL.Value,
		request.DisplayOrder.Set,
		request.DisplayOrder.Value,
		request.IsVisible.Set,
		request.IsVisible.Value,
		request.IsFeatured.Set,
		request.IsFeatured.Value,
	)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "project not found", "failed to update project")
		return
	}

	if previousImageURL != nil {
		previous := sql.NullString{String: *previousImageURL, Valid: true}
		deleteOldProjectImageIfChanged(previous, project.ImageURL)
	}

	response := projectResp.ToProjectResponse(project)
	utils.WriteJSON(w, http.StatusOK, response)
}
