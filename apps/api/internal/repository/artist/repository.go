package artist

import "github.com/PtiCadri/studio/apps/api/internal/repository"

type ArtistRepository struct {
	db repository.Database
}

func New(db repository.Database) *ArtistRepository {
	return &ArtistRepository{db: db}
}
