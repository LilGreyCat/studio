package notification

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	notificationReq "github.com/PtiCadri/studio/apps/api/internal/requests/notification"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Active(w http.ResponseWriter, r *http.Request) {
	item, err := h.repo.Active(r.Context())
	if err != nil {
		http.Error(w, "failed to load notification", http.StatusInternalServerError)
		return
	}
	if item == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	utils.WriteJSON(w, http.StatusOK, item)
}

func (h Handler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.repo.List(r.Context())
	if err != nil {
		http.Error(w, "failed to list notifications", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, items)
}

func (h Handler) Create(w http.ResponseWriter, r *http.Request) {
	var request notificationReq.Write
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := notificationReq.Normalize(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	item, err := h.repo.Create(r.Context(), request)
	if err != nil {
		http.Error(w, "failed to create notification", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, item)
}

func (h Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "notification")
	if !ok {
		return
	}
	var request notificationReq.Write
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if err := notificationReq.Normalize(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	item, err := h.repo.Update(r.Context(), id, request)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "notification not found", "failed to update notification")
		return
	}
	utils.WriteJSON(w, http.StatusOK, item)
}

func (h Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "notification")
	if !ok {
		return
	}
	if err := h.repo.Delete(r.Context(), id); err != nil {
		httpapi.WriteRepositoryError(w, err, "notification not found", "failed to delete notification")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
