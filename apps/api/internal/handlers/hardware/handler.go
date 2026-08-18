package hardware

import hardwareRepo "github.com/PtiCadri/studio/apps/api/internal/repository/hardware"

type Handler struct {
	hardwareRepo *hardwareRepo.Repository
}

func New(repository *hardwareRepo.Repository) Handler {
	return Handler{hardwareRepo: repository}
}
