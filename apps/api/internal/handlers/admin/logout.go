package admin

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/auth"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("admin_session")
	if err == nil {
		tokenHash, hashErr := auth.HashSessionToken(cookie.Value, h.authSecret)
		if hashErr == nil {
			if err := h.repo.DeleteSession(r.Context(), tokenHash); err != nil {
				h.clearAdminSessionCookie(w)
				http.Error(w, "failed to revoke session", http.StatusInternalServerError)
				return
			}
		}
	}
	h.clearAdminSessionCookie(w)

	utils.WriteJSON(w, http.StatusOK, map[string]any{
		"message": "logout successful",
	})
}
