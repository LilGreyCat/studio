package httpapi

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func WriteRepositoryError(w http.ResponseWriter, err error, notFoundMessage, internalMessage string) {
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, notFoundMessage, http.StatusNotFound)
		return
	}
	if utils.IsForeignKeyViolation(err) {
		http.Error(w, notFoundMessage, http.StatusNotFound)
		return
	}
	http.Error(w, internalMessage, http.StatusInternalServerError)
}
