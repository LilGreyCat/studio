package routes

import (
	"database/sql"

	"github.com/PtiCadri/studio/apps/api/internal/config"
	"github.com/PtiCadri/studio/apps/api/internal/handlers"
	adminHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/admin"
	artistHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/artist"
	projectHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/project"
	uploadHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/uploads"

	adminRepo "github.com/PtiCadri/studio/apps/api/internal/repository/admin"
	artistRepo "github.com/PtiCadri/studio/apps/api/internal/repository/artist"
	projectRepo "github.com/PtiCadri/studio/apps/api/internal/repository/project"
)

type Dependencies struct {
	Health   handlers.Health
	Projects projectHandlers.Handler
	Artists  artistHandlers.Handler
	Admins   adminHandlers.Handler
	Uploads  uploadHandlers.Handler
}

func BuildDependencies(
	db *sql.DB,
	cfg config.Config,
) Dependencies {
	projectsRepo := projectRepo.New(db)
	artistsRepo := artistRepo.New(db)
	adminsRepo := adminRepo.New(db)

	return Dependencies{
		Health:   handlers.NewHealth(db),
		Projects: projectHandlers.New(projectsRepo),
		Artists:  artistHandlers.New(artistsRepo),
		Admins:   adminHandlers.New(adminsRepo, cfg.AuthSecret, cfg.CookieSecure),
		Uploads:  uploadHandlers.New(),
	}
}
