package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Reorder(w http.ResponseWriter, r *http.Request) {
	var request projectReq.Reorder
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := projectReq.ValidateReorder(request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	projects, err := h.projectRepo.Reorder(r.Context(), request.IDs)
	if err != nil {
		http.Error(w, "failed to reorder projects", http.StatusInternalServerError)
		return
	}
	if len(projects) != len(request.IDs) {
		http.Error(w, "ids must contain every project", http.StatusBadRequest)
		return
	}
	response := make([]projectResp.ProjectResponse, 0, len(projects))
	for _, project := range projects {
		response = append(response, projectResp.ToProjectResponse(project))
	}
	utils.WriteJSON(w, http.StatusOK, response)
}
