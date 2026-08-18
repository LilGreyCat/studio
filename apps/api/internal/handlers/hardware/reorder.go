package hardware

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	hardwareReq "github.com/PtiCadri/studio/apps/api/internal/requests/hardware"
	hardwareResp "github.com/PtiCadri/studio/apps/api/internal/responses/hardware"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Reorder(w http.ResponseWriter, r *http.Request) {
	var request hardwareReq.Reorder
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := hardwareReq.ValidateReorder(request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	items, err := h.hardwareRepo.Reorder(r.Context(), request.IDs)
	if err != nil {
		http.Error(w, "failed to reorder hardware", http.StatusInternalServerError)
		return
	}
	if len(items) != len(request.IDs) {
		http.Error(w, "ids must contain every hardware item", http.StatusBadRequest)
		return
	}
	response := make([]hardwareResp.Response, 0, len(items))
	for _, item := range items {
		response = append(response, hardwareResp.FromModel(item))
	}
	utils.WriteJSON(w, http.StatusOK, response)
}
