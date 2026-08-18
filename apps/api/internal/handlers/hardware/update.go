package hardware

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	hardwareReq "github.com/PtiCadri/studio/apps/api/internal/requests/hardware"
	hardwareResp "github.com/PtiCadri/studio/apps/api/internal/responses/hardware"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "hardware")
	if !ok {
		return
	}
	var request hardwareReq.Patch
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := hardwareReq.NormalizePatch(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	item, err := h.hardwareRepo.Update(r.Context(), id, request)
	if err != nil {
		if utils.IsUniqueViolation(err) {
			http.Error(w, "hardware slug already exists", http.StatusConflict)
			return
		}
		httpapi.WriteRepositoryError(w, err, "hardware not found", "failed to update hardware")
		return
	}
	utils.WriteJSON(w, http.StatusOK, hardwareResp.FromModel(item))
}
