package admin

import "github.com/PtiCadri/studio/apps/api/internal/repository"

type AdminRepository struct {
	db repository.Database
}

func New(db repository.Database) *AdminRepository {
	return &AdminRepository{db: db}
}
