package admin

import adminRepo "github.com/PtiCadri/studio/apps/api/internal/repository/admin"

type Handler struct {
	repo         *adminRepo.AdminRepository
	authSecret   string
	cookieSecure bool
}

func New(
	repo *adminRepo.AdminRepository,
	authSecret string,
	cookieSecure bool,
) Handler {
	return Handler{
		repo:         repo,
		authSecret:   authSecret,
		cookieSecure: cookieSecure,
	}
}
