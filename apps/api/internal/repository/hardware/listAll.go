package hardware

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *Repository) ListAll(ctx context.Context) ([]models.HardwareItem, error) {
	const query = `
		SELECT
			id, slug, eyebrow, title, description, image_url,
			image_width, image_height, display_order, is_visible,
			created_at, updated_at
		FROM hardware_items
		ORDER BY display_order, id;
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanItems(rows)
}
