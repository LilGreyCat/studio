package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	"github.com/PtiCadri/studio/apps/api/internal/repository"
	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
)

func (r *ProjectRepository) CreateFull(
	ctx context.Context,
	request projectReq.CreateFullProject,
) (models.Project, error) {
	var saved models.Project
	err := repository.WithinTransaction(ctx, r.db, func(db repository.Database) error {
		txRepo := New(db)
		project, err := txRepo.Create(ctx, request.Name, request.ImageURL, request.IsFeatured)
		if err != nil {
			return err
		}
		if _, err = txRepo.PutLinks(ctx, project.ID,
			request.Links.SpotifyURL, request.Links.DeezerURL,
			request.Links.AppleMusicURL, request.Links.SoundcloudURL,
			request.Links.YoutubeURL); err != nil {
			return err
		}
		if _, err = txRepo.PutIntegrations(ctx, project.ID,
			request.Integrations.SpotifyEmbedURL,
			request.Integrations.DeezerEmbedURL,
			request.Integrations.AppleMusicEmbedURL); err != nil {
			return err
		}
		saved = project
		return nil
	})
	return saved, err
}

func (r *ProjectRepository) UpdateFull(
	ctx context.Context,
	id int64,
	request projectReq.UpdateFullProject,
) (models.Project, *string, error) {
	var saved models.Project
	var previousImage *string
	err := repository.WithinTransaction(ctx, r.db, func(db repository.Database) error {
		txRepo := New(db)
		project, previous, err := txRepo.Update(ctx, id,
			request.Project.Name.Set, request.Project.Name.Value,
			request.Project.ImageURL.Set, request.Project.ImageURL.Value,
			request.Project.DisplayOrder.Set, request.Project.DisplayOrder.Value,
			request.Project.IsVisible.Set, request.Project.IsVisible.Value,
			request.Project.IsFeatured.Set, request.Project.IsFeatured.Value)
		if err != nil {
			return err
		}
		if _, err = txRepo.PutLinks(ctx, id,
			request.Links.SpotifyURL, request.Links.DeezerURL,
			request.Links.AppleMusicURL, request.Links.SoundcloudURL,
			request.Links.YoutubeURL); err != nil {
			return err
		}
		if _, err = txRepo.PutIntegrations(ctx, id,
			request.Integrations.SpotifyEmbedURL,
			request.Integrations.DeezerEmbedURL,
			request.Integrations.AppleMusicEmbedURL); err != nil {
			return err
		}
		saved, previousImage = project, previous
		return nil
	})
	return saved, previousImage, err
}
