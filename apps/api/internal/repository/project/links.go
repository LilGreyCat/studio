package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
)

func (r *ProjectRepository) GetLinks(
	ctx context.Context,
	projectID int64,
) (models.ProjectLinks, error) {
	const query = `
		SELECT
			project_id,
			spotify_url,
			deezer_url,
			apple_music_url,
			soundcloud_url,
			youtube_url
		FROM project_links
		WHERE project_id = $1;
	`

	var links models.ProjectLinks

	err := r.db.QueryRowContext(ctx, query, projectID).Scan(
		&links.ProjectID,
		&links.SpotifyURL,
		&links.DeezerURL,
		&links.AppleMusicURL,
		&links.SoundcloudURL,
		&links.YoutubeURL,
	)
	if err != nil {
		return models.ProjectLinks{}, err
	}

	return links, nil
}

func (r *ProjectRepository) PatchLinks(
	ctx context.Context,
	projectID int64,
	patch projectReq.PatchLinks,
) (models.ProjectLinks, error) {
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

func (r *ProjectRepository) PutLinks(
	ctx context.Context, projectID int64,
	spotifyURL, deezerURL, appleMusicURL, soundcloudURL, youtubeURL *string,
) (models.ProjectLinks, error) {
	const query = `
		INSERT INTO project_links (
			project_id, spotify_url, deezer_url, apple_music_url, soundcloud_url, youtube_url
		) VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (project_id) DO UPDATE SET
			spotify_url = EXCLUDED.spotify_url,
			deezer_url = EXCLUDED.deezer_url,
			apple_music_url = EXCLUDED.apple_music_url,
			soundcloud_url = EXCLUDED.soundcloud_url,
			youtube_url = EXCLUDED.youtube_url
		RETURNING project_id, spotify_url, deezer_url, apple_music_url,
			soundcloud_url, youtube_url;
	`
	var links models.ProjectLinks
	err := r.db.QueryRowContext(ctx, query, projectID, spotifyURL, deezerURL,
		appleMusicURL, soundcloudURL, youtubeURL,
	).Scan(&links.ProjectID, &links.SpotifyURL, &links.DeezerURL,
		&links.AppleMusicURL, &links.SoundcloudURL, &links.YoutubeURL)
	return links, err
}
