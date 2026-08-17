package admin

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Logout(w http.ResponseWriter, r *http.Request) {
	h.clearAdminSessionCookie(w)

	utils.WriteJSON(w, http.StatusOK, map[string]any{
		"message": "logout successful",
	})
}
