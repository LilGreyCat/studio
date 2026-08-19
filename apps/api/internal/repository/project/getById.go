package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) GetByID(
	ctx context.Context,
	id int64,
) (models.Project, error) {
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
		WHERE id = $1;
	`

	var project models.Project

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&project.ID,
		&project.Name,
		&project.ImageURL,
		&project.DisplayOrder,
		&project.IsVisible,
		&project.CreatedAt,
		&project.UpdatedAt,
	)
	if err != nil {
		return models.Project{}, err
	}

	return project, nil
}
