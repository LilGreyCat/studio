package project

import (
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

type ProjectResponse struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	ImageURL     *string   `json:"image_url"`
	DisplayOrder int16     `json:"display_order"`
	IsVisible    bool      `json:"is_visible"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func ToProjectResponse(project models.Project) ProjectResponse {
	return ProjectResponse{
		ID:           project.ID,
		Name:         project.Name,
		ImageURL:     utils.NullStringToPointer(project.ImageURL),
		DisplayOrder: project.DisplayOrder,
		IsVisible:    project.IsVisible,
		CreatedAt:    project.CreatedAt,
		UpdatedAt:    project.UpdatedAt,
	}
}
