package admin

import (
	"net/http"
	"time"

	auth "github.com/PtiCadri/studio/apps/api/internal/auth"
)

func (h Handler) setAdminSessionCookie(
	w http.ResponseWriter,
	adminID int64,
	authSecret string,
) {
	expiresAt := time.Now().Add(24 * time.Hour)
	cookieValue := auth.SignUserID(adminID, authSecret, expiresAt)

	http.SetCookie(w, &http.Cookie{
		Name:     "admin_session",
		Value:    cookieValue,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   h.cookieSecure,
		Expires:  expiresAt,
	})
}

func (h Handler) clearAdminSessionCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "admin_session",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   h.cookieSecure,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})
}
