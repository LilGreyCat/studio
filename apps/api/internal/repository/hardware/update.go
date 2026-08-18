package hardware

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	hardwareReq "github.com/PtiCadri/studio/apps/api/internal/requests/hardware"
)

func (r *Repository) Update(
	ctx context.Context,
	id int64,
	request hardwareReq.Patch,
) (models.HardwareItem, string, error) {
	const query = `
		WITH previous AS (
			SELECT image_url
			FROM hardware_items
			WHERE id = $1
			FOR UPDATE
		)
		UPDATE hardware_items AS hardware
		SET
			slug = CASE WHEN $2 THEN $3 ELSE hardware.slug END,
			eyebrow = CASE WHEN $4 THEN $5 ELSE hardware.eyebrow END,
			title = CASE WHEN $6 THEN $7 ELSE hardware.title END,
			description = CASE WHEN $8 THEN $9 ELSE hardware.description END,
			image_url = CASE WHEN $10 THEN $11 ELSE hardware.image_url END,
			image_width = CASE WHEN $12 THEN $13 ELSE hardware.image_width END,
			image_height = CASE WHEN $14 THEN $15 ELSE hardware.image_height END,
			display_order = CASE WHEN $16 THEN $17 ELSE hardware.display_order END,
			is_visible = CASE WHEN $18 THEN $19 ELSE hardware.is_visible END,
			updated_at = NOW()
		FROM previous
		WHERE hardware.id = $1
		RETURNING
			hardware.id, hardware.slug, hardware.eyebrow, hardware.title,
			hardware.description, hardware.image_url, hardware.image_width,
			hardware.image_height, hardware.display_order, hardware.is_visible,
			hardware.created_at, hardware.updated_at, previous.image_url;
	`
	var item models.HardwareItem
	var previousImageURL string
	err := r.db.QueryRowContext(
		ctx,
		query,
		id,
		request.Slug.Set, request.Slug.Value,
		request.Eyebrow.Set, request.Eyebrow.Value,
		request.Title.Set, request.Title.Value,
		request.Description.Set, request.Description.Value,
		request.ImageURL.Set, request.ImageURL.Value,
		request.ImageWidth.Set, request.ImageWidth.Value,
		request.ImageHeight.Set, request.ImageHeight.Value,
		request.DisplayOrder.Set, request.DisplayOrder.Value,
		request.IsVisible.Set, request.IsVisible.Value,
	).Scan(
		&item.ID, &item.Slug, &item.Eyebrow, &item.Title, &item.Description,
		&item.ImageURL, &item.ImageWidth, &item.ImageHeight, &item.DisplayOrder,
		&item.IsVisible, &item.CreatedAt, &item.UpdatedAt, &previousImageURL,
	)
	return item, previousImageURL, err
}
