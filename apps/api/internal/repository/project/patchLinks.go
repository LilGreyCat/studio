package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/requests/project"
)

func (r *ProjectRepository) PatchLinks(ctx context.Context, projectID int64, patch project.PatchLinks) (models.ProjectLinks, error) {
	const query = `
		UPDATE project_links SET
			spotify_url = CASE WHEN $2 THEN $3 ELSE spotify_url END,
			deezer_url = CASE WHEN $4 THEN $5 ELSE deezer_url END,
			apple_music_url = CASE WHEN $6 THEN $7 ELSE apple_music_url END,
			soundcloud_url = CASE WHEN $8 THEN $9 ELSE soundcloud_url END,
			youtube_url = CASE WHEN $10 THEN $11 ELSE youtube_url END
		WHERE project_id = $1
		RETURNING project_id, spotify_url, deezer_url, apple_music_url,
			soundcloud_url, youtube_url;
	`
	var links models.ProjectLinks
	err := r.db.QueryRowContext(ctx, query, projectID,
		patch.SpotifyURL.Set, patch.SpotifyURL.Value,
		patch.DeezerURL.Set, patch.DeezerURL.Value,
		patch.AppleMusicURL.Set, patch.AppleMusicURL.Value,
		patch.SoundcloudURL.Set, patch.SoundcloudURL.Value,
		patch.YoutubeURL.Set, patch.YoutubeURL.Value,
	).Scan(&links.ProjectID, &links.SpotifyURL, &links.DeezerURL,
		&links.AppleMusicURL, &links.SoundcloudURL, &links.YoutubeURL)
	return links, err
}
