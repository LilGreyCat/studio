package hardware

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	hardwareReq "github.com/PtiCadri/studio/apps/api/internal/requests/hardware"
)

func (r *Repository) Create(ctx context.Context, request hardwareReq.Create) (models.HardwareItem, error) {
	const query = `
		INSERT INTO hardware_items (
			slug, eyebrow, title, description, image_url,
			image_width, image_height, display_order, is_visible
		)
		VALUES (
			$1, $2, $3, $4, $5, $6, $7,
			COALESCE($8, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM hardware_items)),
			COALESCE($9, TRUE)
		)
		RETURNING
			id, slug, eyebrow, title, description, image_url,
			image_width, image_height, display_order, is_visible,
			created_at, updated_at;
	`
	var item models.HardwareItem
	err := r.db.QueryRowContext(
		ctx,
		query,
		request.Slug,
		request.Eyebrow,
		request.Title,
		request.Description,
		request.ImageURL,
		request.ImageWidth,
		request.ImageHeight,
		request.DisplayOrder,
		request.IsVisible,
	).Scan(
		&item.ID, &item.Slug, &item.Eyebrow, &item.Title, &item.Description,
		&item.ImageURL, &item.ImageWidth, &item.ImageHeight, &item.DisplayOrder,
		&item.IsVisible, &item.CreatedAt, &item.UpdatedAt,
	)
	return item, err
}
