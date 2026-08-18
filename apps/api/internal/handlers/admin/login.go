package admin

import (
	"net/http"

	adminReq "github.com/PtiCadri/studio/apps/api/internal/requests/admin"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Login(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)

	request, err := adminReq.DecodeLoginRequest(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := validateLoginRequest(request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	admin, err := h.authenticateAdmin(r.Context(), request)
	if err != nil {
		handleLoginError(w, err)
		return
	}

	h.setAdminSessionCookie(w, admin.ID, h.authSecret)
	utils.WriteJSON(w, http.StatusOK, map[string]any{
		"message": "login successful",
	})
}
