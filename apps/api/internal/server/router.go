package server

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"

	"github.com/PtiCadri/studio/apps/api/internal/config"
	"github.com/PtiCadri/studio/apps/api/internal/middleware"
	"github.com/PtiCadri/studio/apps/api/internal/server/routes"
)

func NewRouter(db *sql.DB, cfg config.Config) http.Handler {
	r := chi.NewRouter()
	r.Use(chiMiddleware.Recoverer)
	r.Use(middleware.SecurityHeaders)
	r.Use(middleware.CORS(cfg.FrontendUrl))

	deps := routes.BuildDependencies(db, cfg)

	routes.RegisterStatic(r)
	routes.RegisterHealth(r, deps)
	routes.RegisterAdmin(r, deps, cfg)
	routes.RegisterProjects(r, deps)
	routes.RegisterArtists(r, deps)

	return r
}
