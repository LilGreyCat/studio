package project

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
	projectResp "github.com/PtiCadri/studio/apps/api/internal/responses/project"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Create(w http.ResponseWriter, r *http.Request) {
	var request projectReq.CreateProject

	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}

	name, err := utils.NormalizeEntityName(request.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	project, err := h.projectRepo.Create(
		r.Context(),
		name,
		request.ImageURL,
	)
	if err != nil {
		http.Error(
			w,
			"failed to create project",
			http.StatusInternalServerError,
		)
		return
	}

	response := projectResp.ToProjectResponse(project)

	utils.WriteJSON(w, http.StatusCreated, response)
}
