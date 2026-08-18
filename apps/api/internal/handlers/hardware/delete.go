package hardware

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
)

func (h Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "hardware")
	if !ok {
		return
	}
	if _, err := h.hardwareRepo.Delete(r.Context(), id); err != nil {
		httpapi.WriteRepositoryError(w, err, "hardware not found", "failed to delete hardware")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
