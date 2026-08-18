package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
)

func (r *ArtistRepository) GetIntegrations(
	ctx context.Context,
	artistID int64,
) (models.ArtistIntegrations, error) {
	const query = `
		SELECT
			artist_id,
			spotify_embed_url,
			deezer_embed_url,
			apple_music_embed_url
		FROM artist_integrations
		WHERE artist_id = $1;
	`

	var integrations models.ArtistIntegrations

	err := r.db.QueryRowContext(ctx, query, artistID).Scan(
		&integrations.ArtistID,
		&integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL,
		&integrations.AppleMusicEmbedURL,
	)
	if err != nil {
		return models.ArtistIntegrations{}, err
	}

	return integrations, nil
}

func (r *ArtistRepository) PatchIntegrations(
	ctx context.Context,
	artistID int64,
	patch artistReq.PatchIntegrations,
) (models.ArtistIntegrations, error) {
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

func (r *ArtistRepository) PutIntegrations(
	ctx context.Context,
	artistID int64,
	spotifyEmbedURL, deezerEmbedURL, appleMusicEmbedURL *string,
) (models.ArtistIntegrations, error) {
	const query = `
		INSERT INTO artist_integrations (
			artist_id, spotify_embed_url, deezer_embed_url, apple_music_embed_url
		) VALUES ($1, $2, $3, $4)
		ON CONFLICT (artist_id) DO UPDATE SET
			spotify_embed_url = EXCLUDED.spotify_embed_url,
			deezer_embed_url = EXCLUDED.deezer_embed_url,
			apple_music_embed_url = EXCLUDED.apple_music_embed_url
		RETURNING artist_id, spotify_embed_url, deezer_embed_url, apple_music_embed_url;
	`
	var integrations models.ArtistIntegrations
	err := r.db.QueryRowContext(ctx, query, artistID, spotifyEmbedURL,
		deezerEmbedURL, appleMusicEmbedURL,
	).Scan(&integrations.ArtistID, &integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL, &integrations.AppleMusicEmbedURL)
	return integrations, err
}
