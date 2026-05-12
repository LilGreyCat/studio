package project

import (
	"database/sql"
	"net/http"

	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Patch(w http.ResponseWriter, r *http.Request) {
	projectID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid project id", http.StatusBadRequest)
		return
	}

	var request projectReq.PatchProject
	if err := utils.DecodeJSON(r, &request); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	currentProject, err := h.projectRepo.GetByID(r.Context(), projectID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "project not found", http.StatusNotFound)
			return
		}

		http.Error(w, "failed to fetch project", http.StatusInternalServerError)
		return
	}

	name, imageURL := mergeProjectPatch(currentProject, request)

	project, err := h.projectRepo.Update(
		r.Context(),
		projectID,
		name,
		imageURL,
	)
	if err != nil {
		http.Error(w, "failed to update project", http.StatusInternalServerError)
		return
	}

	deleteOldProjectImageIfChanged(currentProject.ImageURL, project.ImageURL)

	response := projectResp.ToProjectResponse(project)
	utils.WriteJSON(w, http.StatusOK, response)
}
