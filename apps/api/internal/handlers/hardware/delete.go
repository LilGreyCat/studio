package hardware

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	"github.com/PtiCadri/studio/apps/api/internal/storage"
)

func (h Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "hardware")
	if !ok {
		return
	}
	item, err := h.hardwareRepo.Delete(r.Context(), id)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "hardware not found", "failed to delete hardware")
		return
	}
	_ = storage.DeleteUploadedFile(item.ImageURL)
	w.WriteHeader(http.StatusNoContent)
}
