package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) Update(
	ctx context.Context,
	id int64,
	setName bool,
	name *string,
	setImageURL bool,
	imageURL *string,
	setDisplayOrder bool,
	displayOrder *int16,
	setIsVisible bool,
	isVisible *bool,
	setIsFeatured bool,
	isFeatured *bool,
) (models.Project, *string, error) {
	const query = `
		WITH previous AS (
			SELECT image_url
			FROM projects
			WHERE id = $1
			FOR UPDATE
		)
		UPDATE projects AS p
		SET
			name = CASE WHEN $2 THEN $3 ELSE p.name END,
			image_url = CASE WHEN $4 THEN $5 ELSE p.image_url END,
			display_order = CASE WHEN $6 THEN $7 ELSE p.display_order END,
			is_visible = CASE WHEN $8 THEN $9 ELSE p.is_visible END,
			is_featured = CASE WHEN $10 THEN $11 ELSE p.is_featured END,
			updated_at = NOW()
		FROM previous
		WHERE p.id = $1
		RETURNING
			p.id,
			p.name,
			p.image_url,
			p.display_order,
			p.is_visible,
			p.is_featured,
			p.created_at,
			p.updated_at,
			previous.image_url;
	`

	var project models.Project
	var previousImageURL *string

	err := r.db.QueryRowContext(
		ctx,
		query,
		id,
		setName,
		name,
		setImageURL,
		imageURL,
		setDisplayOrder,
		displayOrder,
		setIsVisible,
		isVisible,
		setIsFeatured,
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
		&previousImageURL,
	)
	if err != nil {
		return models.Project{}, nil, err
	}

	return project, previousImageURL, nil
}
