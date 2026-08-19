package admin

import (
	"net/http"
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/auth"
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

	token, err := auth.GenerateSessionToken()
	if err != nil {
		http.Error(w, "failed to create session", http.StatusInternalServerError)
		return
	}
	tokenHash, err := auth.HashSessionToken(token, h.authSecret)
	if err != nil {
		http.Error(w, "failed to create session", http.StatusInternalServerError)
		return
	}
	expiresAt := time.Now().Add(adminSessionLifetime)
	if err := h.repo.ReplaceSessions(r.Context(), admin.ID, tokenHash, expiresAt); err != nil {
		http.Error(w, "failed to create session", http.StatusInternalServerError)
		return
	}
	h.setAdminSessionCookie(w, token, expiresAt)
	utils.WriteJSON(w, http.StatusOK, map[string]any{
		"message": "login successful",
	})
}
