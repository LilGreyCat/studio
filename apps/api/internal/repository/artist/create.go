package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ArtistRepository) Create(
	ctx context.Context,
	name string,
	imageURL *string,
) (models.Artist, error) {
	const query = `
		INSERT INTO artists (
			name,
			image_url, display_order
		)
		VALUES ($1, $2, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM artists))
		RETURNING
			id,
			name,
			image_url,
			display_order, is_visible,
			created_at,
			updated_at;
	`

	var artist models.Artist

	err := r.db.QueryRowContext(
		ctx,
		query,
		name,
		imageURL,
	).Scan(
		&artist.ID,
		&artist.Name,
		&artist.ImageURL,
		&artist.DisplayOrder, &artist.IsVisible,
		&artist.CreatedAt,
		&artist.UpdatedAt,
	)
	if err != nil {
		return models.Artist{}, err
	}

	return artist, nil
}
