package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) List(
	ctx context.Context,
) ([]models.Project, error) {
	const query = `
		SELECT
			id,
			name,
			image_url,
			display_order,
			is_visible,
			created_at,
			updated_at
		FROM projects
		WHERE is_visible
		ORDER BY display_order, id;
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := make([]models.Project, 0)

	for rows.Next() {
		var project models.Project

		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.ImageURL,
			&project.DisplayOrder,
			&project.IsVisible,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		projects = append(projects, project)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return projects, nil
}

func (r *ProjectRepository) ListAll(ctx context.Context) ([]models.Project, error) {
	const query = `
		SELECT id, name, image_url, display_order, is_visible, created_at, updated_at
		FROM projects
		ORDER BY display_order, id;
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	projects := make([]models.Project, 0)
	for rows.Next() {
		var project models.Project
		if err := rows.Scan(&project.ID, &project.Name, &project.ImageURL, &project.DisplayOrder, &project.IsVisible, &project.CreatedAt, &project.UpdatedAt); err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	return projects, rows.Err()
}
