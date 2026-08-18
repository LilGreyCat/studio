package hardware

import (
	"net/http"

	hardwareResp "github.com/PtiCadri/studio/apps/api/internal/responses/hardware"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.hardwareRepo.ListVisible(r.Context())
	if err != nil {
		http.Error(w, "failed to fetch hardware", http.StatusInternalServerError)
		return
	}

	response := make([]hardwareResp.Response, 0, len(items))
	for _, item := range items {
		response = append(response, hardwareResp.FromModel(item))
	}

	utils.WriteJSON(w, http.StatusOK, response)
}
