package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/requests/project"
)

func (r *ProjectRepository) PatchIntegrations(ctx context.Context, projectID int64, patch project.PatchIntegrations) (models.ProjectIntegrations, error) {
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
