package price

import priceRepo "github.com/PtiCadri/studio/apps/api/internal/repository/price"

type Handler struct{ repo *priceRepo.Repository }

func New(repo *priceRepo.Repository) Handler { return Handler{repo: repo} }
