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
			updated_at = NOW()
		FROM previous
		WHERE p.id = $1
		RETURNING
			p.id,
			p.name,
			p.image_url,
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
	).Scan(
		&project.ID,
		&project.Name,
		&project.ImageURL,
		&project.CreatedAt,
		&project.UpdatedAt,
		&previousImageURL,
	)
	if err != nil {
		return models.Project{}, nil, err
	}

	return project, previousImageURL, nil
}
