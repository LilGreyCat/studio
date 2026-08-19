package routes

import (
	"database/sql"

	"github.com/PtiCadri/studio/apps/api/internal/config"
	"github.com/PtiCadri/studio/apps/api/internal/handlers"
	adminHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/admin"
	artistHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/artist"
	hardwareHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/hardware"
	notificationHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/notification"
	projectHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/project"
	uploadHandlers "github.com/PtiCadri/studio/apps/api/internal/handlers/uploads"

	adminRepo "github.com/PtiCadri/studio/apps/api/internal/repository/admin"
	artistRepo "github.com/PtiCadri/studio/apps/api/internal/repository/artist"
	hardwareRepo "github.com/PtiCadri/studio/apps/api/internal/repository/hardware"
	notificationRepo "github.com/PtiCadri/studio/apps/api/internal/repository/notification"
	projectRepo "github.com/PtiCadri/studio/apps/api/internal/repository/project"
)

type Dependencies struct {
	Health        handlers.Health
	Projects      projectHandlers.Handler
	Artists       artistHandlers.Handler
	Hardware      hardwareHandlers.Handler
	Notifications notificationHandlers.Handler
	Admins        adminHandlers.Handler
	Uploads       uploadHandlers.Handler
}

func BuildDependencies(
	db *sql.DB,
	cfg config.Config,
) Dependencies {
	projectsRepo := projectRepo.New(db)
	artistsRepo := artistRepo.New(db)
	hardwareRepository := hardwareRepo.New(db)
	notificationsRepository := notificationRepo.New(db)
	adminsRepo := adminRepo.New(db)

	return Dependencies{
		Health:        handlers.NewHealth(db),
		Projects:      projectHandlers.New(projectsRepo),
		Artists:       artistHandlers.New(artistsRepo),
		Hardware:      hardwareHandlers.New(hardwareRepository),
		Notifications: notificationHandlers.New(notificationsRepository),
		Admins:        adminHandlers.New(adminsRepo, cfg.AuthSecret, cfg.CookieSecure),
		Uploads:       uploadHandlers.New(),
	}
}
