package artist

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Delete(w http.ResponseWriter, r *http.Request) {
	artistID, err := utils.ParseIDParam(r, "id")
	if err != nil {
		http.Error(w, "invalid artist id", http.StatusBadRequest)
		return
	}

	err = h.artistRepo.Delete(r.Context(), artistID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "artist not found", http.StatusNotFound)
			return
		}
		http.Error(w, "failed to delete artist", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
