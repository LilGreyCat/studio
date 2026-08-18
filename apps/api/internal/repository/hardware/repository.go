package hardware

import "github.com/PtiCadri/studio/apps/api/internal/repository"

type Repository struct {
	db repository.Database
}

func New(db repository.Database) *Repository {
	return &Repository{db: db}
}
