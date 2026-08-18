package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
)

func (r *ProjectRepository) GetIntegrations(
	ctx context.Context,
	projectID int64,
) (models.ProjectIntegrations, error) {
	const query = `
		SELECT
			project_id,
			spotify_embed_url,
			deezer_embed_url,
			apple_music_embed_url
		FROM project_integrations
		WHERE project_id = $1;
	`

	var integrations models.ProjectIntegrations

	err := r.db.QueryRowContext(ctx, query, projectID).Scan(
		&integrations.ProjectID,
		&integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL,
		&integrations.AppleMusicEmbedURL,
	)
	if err != nil {
		return models.ProjectIntegrations{}, err
	}

	return integrations, nil
}

func (r *ProjectRepository) PatchIntegrations(
	ctx context.Context,
	projectID int64,
	patch projectReq.PatchIntegrations,
) (models.ProjectIntegrations, error) {
	const query = `
		UPDATE project_integrations SET
			spotify_embed_url = CASE WHEN $2 THEN $3 ELSE spotify_embed_url END,
			deezer_embed_url = CASE WHEN $4 THEN $5 ELSE deezer_embed_url END,
			apple_music_embed_url = CASE WHEN $6 THEN $7 ELSE apple_music_embed_url END
		WHERE project_id = $1
		RETURNING project_id, spotify_embed_url, deezer_embed_url, apple_music_embed_url;
	`
	var integrations models.ProjectIntegrations
	err := r.db.QueryRowContext(ctx, query, projectID,
		patch.SpotifyEmbedURL.Set, patch.SpotifyEmbedURL.Value,
		patch.DeezerEmbedURL.Set, patch.DeezerEmbedURL.Value,
		patch.AppleMusicEmbedURL.Set, patch.AppleMusicEmbedURL.Value,
	).Scan(&integrations.ProjectID, &integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL, &integrations.AppleMusicEmbedURL)
	return integrations, err
}

func (r *ProjectRepository) PutIntegrations(
	ctx context.Context,
	projectID int64,
	spotifyEmbedURL, deezerEmbedURL, appleMusicEmbedURL *string,
) (models.ProjectIntegrations, error) {
	const query = `
		INSERT INTO project_integrations (
			project_id, spotify_embed_url, deezer_embed_url, apple_music_embed_url
		) VALUES ($1, $2, $3, $4)
		ON CONFLICT (project_id) DO UPDATE SET
			spotify_embed_url = EXCLUDED.spotify_embed_url,
			deezer_embed_url = EXCLUDED.deezer_embed_url,
			apple_music_embed_url = EXCLUDED.apple_music_embed_url
		RETURNING project_id, spotify_embed_url, deezer_embed_url, apple_music_embed_url;
	`
	var integrations models.ProjectIntegrations
	err := r.db.QueryRowContext(ctx, query, projectID, spotifyEmbedURL,
		deezerEmbedURL, appleMusicEmbedURL,
	).Scan(&integrations.ProjectID, &integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL, &integrations.AppleMusicEmbedURL)
	return integrations, err
}
