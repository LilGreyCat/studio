package hardware

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	hardwareReq "github.com/PtiCadri/studio/apps/api/internal/requests/hardware"
	hardwareResp "github.com/PtiCadri/studio/apps/api/internal/responses/hardware"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Create(w http.ResponseWriter, r *http.Request) {
	var request hardwareReq.Create
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := hardwareReq.NormalizeCreate(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	item, err := h.hardwareRepo.Create(r.Context(), request)
	if err != nil {
		if utils.IsUniqueViolation(err) {
			http.Error(w, "hardware slug already exists", http.StatusConflict)
			return
		}
		http.Error(w, "failed to create hardware", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, hardwareResp.FromModel(item))
}
