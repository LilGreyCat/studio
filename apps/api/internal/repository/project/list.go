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
			created_at,
			updated_at
		FROM projects
		ORDER BY id DESC;
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
