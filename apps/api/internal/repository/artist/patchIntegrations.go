package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/requests/artist"
)

func (r *ArtistRepository) PatchIntegrations(ctx context.Context, artistID int64, patch artist.PatchIntegrations) (models.ArtistIntegrations, error) {
	const query = `
		UPDATE artist_integrations SET
			spotify_embed_url = CASE WHEN $2 THEN $3 ELSE spotify_embed_url END,
			deezer_embed_url = CASE WHEN $4 THEN $5 ELSE deezer_embed_url END,
			apple_music_embed_url = CASE WHEN $6 THEN $7 ELSE apple_music_embed_url END
		WHERE artist_id = $1
		RETURNING artist_id, spotify_embed_url, deezer_embed_url, apple_music_embed_url;
	`
	var integrations models.ArtistIntegrations
	err := r.db.QueryRowContext(ctx, query, artistID,
		patch.SpotifyEmbedURL.Set, patch.SpotifyEmbedURL.Value,
		patch.DeezerEmbedURL.Set, patch.DeezerEmbedURL.Value,
		patch.AppleMusicEmbedURL.Set, patch.AppleMusicEmbedURL.Value,
	).Scan(&integrations.ArtistID, &integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL, &integrations.AppleMusicEmbedURL)
	return integrations, err
}
