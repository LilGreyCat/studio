package hardware

import (
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

type Response struct {
	ID           int64     `json:"id"`
	Slug         string    `json:"slug"`
	Eyebrow      string    `json:"eyebrow"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	ImageURL     string    `json:"image_url"`
	ImageWidth   int16     `json:"image_width"`
	ImageHeight  int16     `json:"image_height"`
	DisplayOrder int16     `json:"display_order"`
	IsVisible    bool      `json:"is_visible"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func FromModel(item models.HardwareItem) Response {
	return Response{
		ID:           item.ID,
		Slug:         item.Slug,
		Eyebrow:      item.Eyebrow,
		Title:        item.Title,
		Description:  item.Description,
		ImageURL:     item.ImageURL,
		ImageWidth:   item.ImageWidth,
		ImageHeight:  item.ImageHeight,
		DisplayOrder: item.DisplayOrder,
		IsVisible:    item.IsVisible,
		CreatedAt:    item.CreatedAt,
		UpdatedAt:    item.UpdatedAt,
	}
}
