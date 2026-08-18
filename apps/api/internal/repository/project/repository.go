package project

import "github.com/PtiCadri/studio/apps/api/internal/repository"

type ProjectRepository struct {
	db repository.Database
}

func New(db repository.Database) *ProjectRepository {
	return &ProjectRepository{db: db}
}
