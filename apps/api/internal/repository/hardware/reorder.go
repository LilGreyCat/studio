package hardware

import (
	"context"
	"encoding/json"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *Repository) Reorder(ctx context.Context, ids []int64) ([]models.HardwareItem, error) {
	const query = `
		WITH requested AS (
			SELECT value::bigint AS id, position
			FROM jsonb_array_elements_text($1::jsonb)
				WITH ORDINALITY AS ordered(value, position)
		), valid_request AS (
			SELECT TRUE AS valid
			WHERE (SELECT COUNT(*) FROM requested) = (SELECT COUNT(*) FROM hardware_items)
			  AND NOT EXISTS (
				SELECT 1 FROM requested
				LEFT JOIN hardware_items ON hardware_items.id = requested.id
				WHERE hardware_items.id IS NULL
			  )
		), updated AS (
			UPDATE hardware_items
			SET display_order = requested.position::smallint,
				updated_at = NOW()
			FROM requested, valid_request
			WHERE hardware_items.id = requested.id
			RETURNING hardware_items.*
		)
		SELECT
			id, slug, eyebrow, title, description, image_url,
			image_width, image_height, display_order, is_visible,
			created_at, updated_at
		FROM updated
		ORDER BY display_order, id;
	`
	encodedIDs, err := json.Marshal(ids)
	if err != nil {
		return nil, err
	}
	rows, err := r.db.QueryContext(ctx, query, string(encodedIDs))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanItems(rows)
}
