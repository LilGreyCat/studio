package utils

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func ParseIDParam(r *http.Request, key string) (int64, error) {
	idStr := chi.URLParam(r, key)
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		return 0, err
	}
	if id <= 0 {
		return 0, errors.New("id must be positive")
	}
	return id, nil
}
