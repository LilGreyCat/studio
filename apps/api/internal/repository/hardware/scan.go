package hardware

import (
	"database/sql"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func scanItems(rows *sql.Rows) ([]models.HardwareItem, error) {
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
