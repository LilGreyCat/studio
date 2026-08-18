package routes

import (
	"time"

	"github.com/go-chi/chi/v5"

	"github.com/PtiCadri/studio/apps/api/internal/config"
	"github.com/PtiCadri/studio/apps/api/internal/middleware"
)

func RegisterAdmin(
	r chi.Router,
	deps Dependencies,
	cfg config.Config,
) {
	r.Route("/admin", func(r chi.Router) {
		registerAdminPublic(r, deps)
		registerAdminProtected(r, deps, cfg)
	})
}

func registerAdminPublic(r chi.Router, deps Dependencies) {
	r.With(middleware.RateLimit(10, 15*time.Minute)).Post(
		"/login",
		deps.Admins.Login,
	)
}

func registerAdminSession(r chi.Router, deps Dependencies) {
	r.Get("/me", deps.Admins.Me)
	r.Post("/logout", deps.Admins.Logout)
}

func registerAdminProtected(
	r chi.Router,
	deps Dependencies,
	cfg config.Config,
) {
	r.Group(func(r chi.Router) {
		r.Use(middleware.AdminAuth(cfg.AuthSecret))

		registerAdminSession(r, deps)
		registerAdminUploads(r, deps)
		registerAdminProjects(r, deps)
		registerAdminArtists(r, deps)
	})
}

func registerAdminUploads(r chi.Router, deps Dependencies) {
	r.Post("/uploads", deps.Uploads.Create)
}

func registerAdminProjects(r chi.Router, deps Dependencies) {
	r.Post("/projects", deps.Projects.Create)
	r.Delete("/projects/{id}", deps.Projects.Delete)
	r.Patch("/projects/{id}", deps.Projects.Patch)

	r.Put("/projects/{id}/links", deps.Projects.PutLinks)
	r.Patch("/projects/{id}/links", deps.Projects.PatchLinks)

	r.Put(
		"/projects/{id}/integrations",
		deps.Projects.PutIntegrations,
	)
	r.Patch(
		"/projects/{id}/integrations",
		deps.Projects.PatchIntegrations,
	)

	r.Post("/projects/{id}/artists", deps.Projects.AddArtist)
	r.Delete(
		"/projects/{id}/artists/{artistId}",
		deps.Projects.RemoveArtist,
	)
}

func registerAdminArtists(r chi.Router, deps Dependencies) {
	r.Post("/artists", deps.Artists.Create)
	r.Delete("/artists/{id}", deps.Artists.Delete)
	r.Patch("/artists/{id}", deps.Artists.Patch)

	r.Put("/artists/{id}/links", deps.Artists.PutLinks)
	r.Patch("/artists/{id}/links", deps.Artists.PatchLinks)

	r.Put(
		"/artists/{id}/integrations",
		deps.Artists.PutIntegrations,
	)
	r.Patch(
		"/artists/{id}/integrations",
		deps.Artists.PatchIntegrations,
	)
}
