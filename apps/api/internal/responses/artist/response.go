package artist

import (
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

type ArtistResponse struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	ImageURL     *string   `json:"image_url"`
	DisplayOrder int16     `json:"display_order"`
	IsVisible    bool      `json:"is_visible"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func ToArtistResponse(artist models.Artist) ArtistResponse {
	return ArtistResponse{
		ID:           artist.ID,
		Name:         artist.Name,
		ImageURL:     utils.NullStringToPointer(artist.ImageURL),
		DisplayOrder: artist.DisplayOrder,
		IsVisible:    artist.IsVisible,
		CreatedAt:    artist.CreatedAt,
		UpdatedAt:    artist.UpdatedAt,
	}
}

func ToArtistResponses(artists []models.Artist) []ArtistResponse {
	response := make([]ArtistResponse, 0, len(artists))

	for _, artist := range artists {
		response = append(response, ToArtistResponse(artist))
	}

	return response
}
