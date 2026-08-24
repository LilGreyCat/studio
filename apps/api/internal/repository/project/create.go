package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) Create(
	ctx context.Context,
	name string,
	imageURL *string,
	isFeatured bool,
) (models.Project, error) {
	const query = `
		WITH shifted AS (
			UPDATE projects
			SET display_order = display_order + 1
		)
		INSERT INTO projects (
			name,
			image_url,
			display_order,
			is_featured
		)
		VALUES ($1, $2, 1, $3)
		RETURNING
			id,
			name,
			image_url,
			display_order,
			is_visible,
			is_featured,
			created_at,
			updated_at;
	`

	var project models.Project

	err := r.db.QueryRowContext(
		ctx,
		query,
		name,
		imageURL,
		isFeatured,
	).Scan(
		&project.ID,
		&project.Name,
		&project.ImageURL,
		&project.DisplayOrder,
		&project.IsVisible,
		&project.IsFeatured,
		&project.CreatedAt,
		&project.UpdatedAt,
	)
	if err != nil {
		return models.Project{}, err
	}

	return project, nil
}
