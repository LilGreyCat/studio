package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ArtistRepository) Delete(
	ctx context.Context,
	id int64,
) (models.Artist, error) {
	const query = `
		DELETE FROM artists
		WHERE id = $1
		RETURNING id, name, image_url, display_order, is_visible, created_at, updated_at;
	`

	var artist models.Artist
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&artist.ID, &artist.Name, &artist.ImageURL,
		&artist.DisplayOrder, &artist.IsVisible,
		&artist.CreatedAt, &artist.UpdatedAt,
	)
	return artist, err
}
