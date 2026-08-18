package routes

import "github.com/go-chi/chi/v5"

func RegisterHardware(r chi.Router, deps Dependencies) {
	r.Get("/hardware", deps.Hardware.List)
}
