package httpapi

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func ParseID(w http.ResponseWriter, r *http.Request, key, resource string) (int64, bool) {
	id, err := utils.ParseIDParam(r, key)
	if err != nil {
		http.Error(w, "invalid "+resource+" id", http.StatusBadRequest)
		return 0, false
	}
	return id, true
}

func DecodeJSON(w http.ResponseWriter, r *http.Request, destination any) bool {
	if err := utils.DecodeJSON(r, destination); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return false
	}
	return true
}
