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
	if !request.Name.Set && !request.ImageURL.Set {
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

	project, previousImageURL, err := h.projectRepo.Update(
		r.Context(),
		projectID,
		request.Name.Set,
		request.Name.Value,
		request.ImageURL.Set,
		request.ImageURL.Value,
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
