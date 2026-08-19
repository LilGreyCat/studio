package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ArtistRepository) GetByID(
	ctx context.Context,
	id int64,
) (models.Artist, error) {
	const query = `
		SELECT
			id,
			name,
			image_url,
			display_order, is_visible,
			created_at,
			updated_at
		FROM artists
		WHERE id = $1;
	`

	var artist models.Artist

	err := r.db.QueryRowContext(ctx, query, id).Scan(
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
