package artist

import (
	"context"
	"encoding/json"
	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ArtistRepository) Reorder(ctx context.Context, ids []int64) ([]models.Artist, error) {
	const query = `WITH requested AS (SELECT value::bigint AS id, position FROM jsonb_array_elements_text($1::jsonb) WITH ORDINALITY AS ordered(value, position)), valid_request AS (SELECT TRUE WHERE (SELECT COUNT(*) FROM requested) = (SELECT COUNT(*) FROM artists) AND NOT EXISTS (SELECT 1 FROM requested LEFT JOIN artists ON artists.id = requested.id WHERE artists.id IS NULL)), updated AS (UPDATE artists SET display_order = requested.position::smallint, updated_at = NOW() FROM requested, valid_request WHERE artists.id = requested.id RETURNING artists.*) SELECT id, name, image_url, display_order, is_visible, created_at, updated_at FROM updated ORDER BY display_order, id;`
	encoded, err := json.Marshal(ids)
	if err != nil {
		return nil, err
	}
	rows, err := r.db.QueryContext(ctx, query, string(encoded))
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
