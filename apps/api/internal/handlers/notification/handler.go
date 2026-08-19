package notification

import notificationRepo "github.com/PtiCadri/studio/apps/api/internal/repository/notification"

type Handler struct{ repo *notificationRepo.Repository }

func New(repo *notificationRepo.Repository) Handler { return Handler{repo: repo} }
