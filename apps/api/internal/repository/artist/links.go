package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
)

func (r *ArtistRepository) GetLinks(
	ctx context.Context,
	artistID int64,
) (models.ArtistLinks, error) {
	const query = `
		SELECT
			artist_id,
			spotify_url,
			deezer_url,
			apple_music_url,
			soundcloud_url,
			youtube_url,
			instagram_url,
			tiktok_url
		FROM artist_links
		WHERE artist_id = $1;
	`

	var links models.ArtistLinks

	err := r.db.QueryRowContext(ctx, query, artistID).Scan(
		&links.ArtistID,
		&links.SpotifyURL,
		&links.DeezerURL,
		&links.AppleMusicURL,
		&links.SoundcloudURL,
		&links.YoutubeURL,
		&links.InstagramURL,
		&links.TiktokURL,
	)
	if err != nil {
		return models.ArtistLinks{}, err
	}

	return links, nil
}

func (r *ArtistRepository) PatchLinks(
	ctx context.Context,
	artistID int64,
	patch artistReq.PatchLinks,
) (models.ArtistLinks, error) {
	const query = `
		UPDATE artist_links SET
			spotify_url = CASE WHEN $2 THEN $3 ELSE spotify_url END,
			deezer_url = CASE WHEN $4 THEN $5 ELSE deezer_url END,
			apple_music_url = CASE WHEN $6 THEN $7 ELSE apple_music_url END,
			soundcloud_url = CASE WHEN $8 THEN $9 ELSE soundcloud_url END,
			youtube_url = CASE WHEN $10 THEN $11 ELSE youtube_url END,
			instagram_url = CASE WHEN $12 THEN $13 ELSE instagram_url END,
			tiktok_url = CASE WHEN $14 THEN $15 ELSE tiktok_url END
		WHERE artist_id = $1
		RETURNING artist_id, spotify_url, deezer_url, apple_music_url,
			soundcloud_url, youtube_url, instagram_url, tiktok_url;
	`
	var links models.ArtistLinks
	err := r.db.QueryRowContext(ctx, query, artistID,
		patch.SpotifyURL.Set, patch.SpotifyURL.Value,
		patch.DeezerURL.Set, patch.DeezerURL.Value,
		patch.AppleMusicURL.Set, patch.AppleMusicURL.Value,
		patch.SoundcloudURL.Set, patch.SoundcloudURL.Value,
		patch.YoutubeURL.Set, patch.YoutubeURL.Value,
		patch.InstagramURL.Set, patch.InstagramURL.Value,
		patch.TiktokURL.Set, patch.TiktokURL.Value,
	).Scan(&links.ArtistID, &links.SpotifyURL, &links.DeezerURL,
		&links.AppleMusicURL, &links.SoundcloudURL, &links.YoutubeURL,
		&links.InstagramURL, &links.TiktokURL)
	return links, err
}

func (r *ArtistRepository) PutLinks(
	ctx context.Context, artistID int64,
	spotifyURL, deezerURL, appleMusicURL, soundcloudURL, youtubeURL, instagramURL, tiktokURL *string,
) (models.ArtistLinks, error) {
	const query = `
		INSERT INTO artist_links (
			artist_id, spotify_url, deezer_url, apple_music_url,
			soundcloud_url, youtube_url, instagram_url, tiktok_url
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (artist_id) DO UPDATE SET
			spotify_url = EXCLUDED.spotify_url,
			deezer_url = EXCLUDED.deezer_url,
			apple_music_url = EXCLUDED.apple_music_url,
			soundcloud_url = EXCLUDED.soundcloud_url,
			youtube_url = EXCLUDED.youtube_url,
			instagram_url = EXCLUDED.instagram_url,
			tiktok_url = EXCLUDED.tiktok_url
		RETURNING artist_id, spotify_url, deezer_url, apple_music_url,
			soundcloud_url, youtube_url, instagram_url, tiktok_url;
	`
	var links models.ArtistLinks
	err := r.db.QueryRowContext(ctx, query, artistID, spotifyURL, deezerURL,
		appleMusicURL, soundcloudURL, youtubeURL, instagramURL, tiktokURL,
	).Scan(&links.ArtistID, &links.SpotifyURL, &links.DeezerURL,
		&links.AppleMusicURL, &links.SoundcloudURL, &links.YoutubeURL,
		&links.InstagramURL, &links.TiktokURL)
	return links, err
}
