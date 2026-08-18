package hardware

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *Repository) ListVisible(
	ctx context.Context,
) ([]models.HardwareItem, error) {
	const query = `
		SELECT
			id,
			slug,
			eyebrow,
			title,
			description,
			image_url,
			image_width,
			image_height,
			display_order,
			is_visible,
			created_at,
			updated_at
		FROM hardware_items
		WHERE is_visible
		ORDER BY display_order, id;
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]models.HardwareItem, 0)

	for rows.Next() {
		var item models.HardwareItem

		if err := rows.Scan(
			&item.ID,
			&item.Slug,
			&item.Eyebrow,
			&item.Title,
			&item.Description,
			&item.ImageURL,
			&item.ImageWidth,
			&item.ImageHeight,
			&item.DisplayOrder,
			&item.IsVisible,
			&item.CreatedAt,
			&item.UpdatedAt,
		); err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}
