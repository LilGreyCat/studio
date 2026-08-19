package price

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	priceReq "github.com/PtiCadri/studio/apps/api/internal/requests/price"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.repo.List(r.Context())
	if err != nil {
		http.Error(w, "failed to list prices", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, items)
}

func (h Handler) UpdateAll(w http.ResponseWriter, r *http.Request) {
	var request priceReq.UpdateAll
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := priceReq.Validate(request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	items, err := h.repo.UpdateAll(r.Context(), request.Prices)
	if err != nil {
		http.Error(w, "failed to update prices", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, items)
}
