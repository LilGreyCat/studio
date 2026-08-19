package project

import (
	"time"

	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

type ProjectDetailResponse struct {
	ID           int64                       `json:"id"`
	Name         string                      `json:"name"`
	ImageURL     *string                     `json:"image_url"`
	DisplayOrder int16                       `json:"display_order"`
	IsVisible    bool                        `json:"is_visible"`
	CreatedAt    time.Time                   `json:"created_at"`
	UpdatedAt    time.Time                   `json:"updated_at"`
	Artists      []artistResp.ArtistResponse `json:"artists"`
}

func ToProjectDetailResponse(
	project models.Project,
	artists []models.Artist,
) ProjectDetailResponse {
	base := ToProjectResponse(project)

	return ProjectDetailResponse{
		ID:           base.ID,
		Name:         base.Name,
		ImageURL:     base.ImageURL,
		DisplayOrder: base.DisplayOrder,
		IsVisible:    base.IsVisible,
		CreatedAt:    base.CreatedAt,
		UpdatedAt:    base.UpdatedAt,
		Artists:      artistResp.ToArtistResponses(artists),
	}
}
