package artist

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/repository"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
)

func (r *ArtistRepository) CreateFull(ctx context.Context, request artistReq.CreateFullArtist) (models.Artist, error) {
	var saved models.Artist
	err := repository.WithinTransaction(ctx, r.db, func(db repository.Database) error {
		txRepo := New(db)
		artist, err := txRepo.Create(ctx, request.Name, request.ImageURL)
		if err != nil {
			return err
		}
		if _, err = txRepo.PutLinks(ctx, artist.ID,
			request.Links.SpotifyURL, request.Links.DeezerURL,
			request.Links.AppleMusicURL, request.Links.SoundcloudURL,
			request.Links.YoutubeURL, request.Links.InstagramURL,
			request.Links.TiktokURL); err != nil {
			return err
		}
		if _, err = txRepo.PutIntegrations(ctx, artist.ID,
			request.Integrations.SpotifyEmbedURL,
			request.Integrations.DeezerEmbedURL,
			request.Integrations.AppleMusicEmbedURL); err != nil {
			return err
		}
		saved = artist
		return nil
	})
	return saved, err
}

func (r *ArtistRepository) UpdateFull(ctx context.Context, id int64, request artistReq.UpdateFullArtist) (models.Artist, error) {
	var saved models.Artist
	err := repository.WithinTransaction(ctx, r.db, func(db repository.Database) error {
		txRepo := New(db)
		artist, err := txRepo.Update(ctx, id,
			request.Artist.Name.Set, request.Artist.Name.Value,
			request.Artist.ImageURL.Set, request.Artist.ImageURL.Value,
			request.Artist.DisplayOrder.Set, request.Artist.DisplayOrder.Value,
			request.Artist.IsVisible.Set, request.Artist.IsVisible.Value)
		if err != nil {
			return err
		}
		if _, err = txRepo.PutLinks(ctx, id,
			request.Links.SpotifyURL, request.Links.DeezerURL,
			request.Links.AppleMusicURL, request.Links.SoundcloudURL,
			request.Links.YoutubeURL, request.Links.InstagramURL,
			request.Links.TiktokURL); err != nil {
			return err
		}
		if _, err = txRepo.PutIntegrations(ctx, id,
			request.Integrations.SpotifyEmbedURL,
			request.Integrations.DeezerEmbedURL,
			request.Integrations.AppleMusicEmbedURL); err != nil {
			return err
		}
		saved = artist
		return nil
	})
	return saved, err
}
