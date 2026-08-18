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
) (models.HardwareItem, error) {
	const query = `
		UPDATE hardware_items
		SET
			slug = CASE WHEN $2 THEN $3 ELSE slug END,
			eyebrow = CASE WHEN $4 THEN $5 ELSE eyebrow END,
			title = CASE WHEN $6 THEN $7 ELSE title END,
			description = CASE WHEN $8 THEN $9 ELSE description END,
			image_url = CASE WHEN $10 THEN $11 ELSE image_url END,
			image_width = CASE WHEN $12 THEN $13 ELSE image_width END,
			image_height = CASE WHEN $14 THEN $15 ELSE image_height END,
			display_order = CASE WHEN $16 THEN $17 ELSE display_order END,
			is_visible = CASE WHEN $18 THEN $19 ELSE is_visible END,
			updated_at = NOW()
		WHERE id = $1
		RETURNING
			id, slug, eyebrow, title, description, image_url,
			image_width, image_height, display_order, is_visible,
			created_at, updated_at;
	`
	var item models.HardwareItem
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
		&item.IsVisible, &item.CreatedAt, &item.UpdatedAt,
	)
	return item, err
}
