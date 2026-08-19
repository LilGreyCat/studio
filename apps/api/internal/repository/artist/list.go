package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ArtistRepository) List(
	ctx context.Context,
) ([]models.Artist, error) {
	const query = `
		SELECT
			id,
			name,
			image_url,
			display_order,
			is_visible,
			created_at,
			updated_at
		FROM artists WHERE is_visible
		ORDER BY display_order, id;
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	artists := make([]models.Artist, 0)

	for rows.Next() {
		var artist models.Artist

		err := rows.Scan(
			&artist.ID,
			&artist.Name,
			&artist.ImageURL,
			&artist.DisplayOrder,
			&artist.IsVisible,
			&artist.CreatedAt,
			&artist.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		artists = append(artists, artist)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return artists, nil
}

func (r *ArtistRepository) ListAll(ctx context.Context) ([]models.Artist, error) {
	const query = `SELECT id, name, image_url, display_order, is_visible, created_at, updated_at FROM artists ORDER BY display_order, id;`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	artists := make([]models.Artist, 0)
	for rows.Next() {
		var artist models.Artist
		if err := rows.Scan(&artist.ID, &artist.Name, &artist.ImageURL, &artist.DisplayOrder, &artist.IsVisible, &artist.CreatedAt, &artist.UpdatedAt); err != nil {
			return nil, err
		}
		artists = append(artists, artist)
	}
	return artists, rows.Err()
}
