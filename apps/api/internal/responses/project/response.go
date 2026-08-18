package project

import (
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

type ProjectResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	ImageURL  *string   `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ProjectOverviewResponse struct {
	ProjectResponse
	Links        ProjectLinksResponse        `json:"links"`
	Integrations ProjectIntegrationsResponse `json:"integrations"`
}

func ToProjectResponse(project models.Project) ProjectResponse {
	return ProjectResponse{
		ID:        project.ID,
		Name:      project.Name,
		ImageURL:  utils.NullStringToPointer(project.ImageURL),
		CreatedAt: project.CreatedAt,
		UpdatedAt: project.UpdatedAt,
	}
}

func ToProjectOverviewResponse(project models.ProjectOverview) ProjectOverviewResponse {
	return ProjectOverviewResponse{
		ProjectResponse: ToProjectResponse(project.Project),
		Links:           ToProjectLinksResponse(project.Links),
		Integrations:    ToProjectIntegrationsResponse(project.Integrations),
	}
}
