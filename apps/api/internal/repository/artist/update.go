package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ArtistRepository) Update(
	ctx context.Context,
	id int64,
	setName bool,
	name *string,
	setImageURL bool,
	imageURL *string,
) (models.Artist, error) {
	const query = `
		UPDATE artists
		SET
			name = CASE WHEN $2 THEN $3 ELSE name END,
			image_url = CASE WHEN $4 THEN $5 ELSE image_url END,
			updated_at = NOW()
		WHERE id = $1
		RETURNING
			id,
			name,
			image_url,
			created_at,
			updated_at;
	`

	var artist models.Artist

	err := r.db.QueryRowContext(
		ctx,
		query,
		id,
		setName,
		name,
		setImageURL,
		imageURL,
	).Scan(
		&artist.ID,
		&artist.Name,
		&artist.ImageURL,
		&artist.CreatedAt,
		&artist.UpdatedAt,
	)
	if err != nil {
		return models.Artist{}, err
	}

	return artist, nil
}
