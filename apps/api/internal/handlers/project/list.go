package project

import (
	"net/http"

	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) List(w http.ResponseWriter, r *http.Request) {
	projects, err := h.projectRepo.List(r.Context())
	if err != nil {
		http.Error(w, "failed to fetch projects", http.StatusInternalServerError)
		return
	}

	response := make([]projectResp.ProjectOverviewResponse, 0, len(projects))

	for _, project := range projects {
		response = append(response, projectResp.ToProjectOverviewResponse(project))
	}

	utils.WriteJSON(w, http.StatusOK, response)
}
