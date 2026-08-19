package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) Create(
	ctx context.Context,
	name string,
	imageURL *string,
) (models.Project, error) {
	const query = `
		INSERT INTO projects (
			name,
			image_url,
			display_order
		)
		VALUES ($1, $2, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM projects))
		RETURNING
			id,
			name,
			image_url,
			display_order,
			is_visible,
			created_at,
			updated_at;
	`

	var project models.Project

	err := r.db.QueryRowContext(
		ctx,
		query,
		name,
		imageURL,
	).Scan(
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
