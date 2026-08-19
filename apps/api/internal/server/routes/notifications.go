package routes

import "github.com/go-chi/chi/v5"

func RegisterNotifications(r chi.Router, deps Dependencies) {
	r.Get("/notifications/active", deps.Notifications.Active)
}
