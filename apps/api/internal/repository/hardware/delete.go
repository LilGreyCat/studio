package hardware

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *Repository) Delete(ctx context.Context, id int64) (models.HardwareItem, error) {
	const query = `
		DELETE FROM hardware_items
		WHERE id = $1
		RETURNING
			id, slug, eyebrow, title, description, image_url,
			image_width, image_height, display_order, is_visible,
			created_at, updated_at;
	`
	var item models.HardwareItem
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&item.ID, &item.Slug, &item.Eyebrow, &item.Title, &item.Description,
		&item.ImageURL, &item.ImageWidth, &item.ImageHeight, &item.DisplayOrder,
		&item.IsVisible, &item.CreatedAt, &item.UpdatedAt,
	)
	return item, err
}
