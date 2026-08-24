package project

import (
	"context"
	"encoding/json"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) Reorder(ctx context.Context, ids []int64) ([]models.Project, error) {
	const query = `
		WITH requested AS (
			SELECT value::bigint AS id, position
			FROM jsonb_array_elements_text($1::jsonb)
				WITH ORDINALITY AS ordered(value, position)
		), valid_request AS (
			SELECT TRUE AS valid
			WHERE (SELECT COUNT(*) FROM requested) = (SELECT COUNT(*) FROM projects)
			  AND NOT EXISTS (
				SELECT 1 FROM requested
				LEFT JOIN projects ON projects.id = requested.id
				WHERE projects.id IS NULL
			  )
		), updated AS (
			UPDATE projects
			SET display_order = requested.position::smallint, updated_at = NOW()
			FROM requested, valid_request
			WHERE projects.id = requested.id
			RETURNING projects.*
		)
		SELECT id, name, image_url, display_order, is_visible, is_featured, created_at, updated_at
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
	projects := make([]models.Project, 0)
	for rows.Next() {
		var project models.Project
		if err := rows.Scan(&project.ID, &project.Name, &project.ImageURL, &project.DisplayOrder, &project.IsVisible, &project.IsFeatured, &project.CreatedAt, &project.UpdatedAt); err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	return projects, rows.Err()
}
