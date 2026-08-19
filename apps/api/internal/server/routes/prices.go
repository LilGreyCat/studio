package routes

import "github.com/go-chi/chi/v5"

func RegisterPrices(r chi.Router, deps Dependencies) {
	r.Get("/prices", deps.Prices.List)
}
