package middleware

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/auth"
)

type AdminSessionStore interface {
	GetSessionAdminID(context.Context, []byte, time.Time) (int64, error)
}

type contextKey string

const adminIDKey contextKey = "admin_id"

// AdminAuth returns a middleware function that checks if the admin_session cookie is valid.
// If the cookie is invalid, it returns a 401 Unauthorized response.
// If the cookie is valid, it sets the admin_id context key to the value of the cookie.
func AdminAuth(store AdminSessionStore, secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("admin_session")
			if err != nil {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			tokenHash, err := auth.HashSessionToken(cookie.Value, secret)
			if err != nil {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			adminID, err := store.GetSessionAdminID(r.Context(), tokenHash, time.Now())
			if err != nil {
				if err != sql.ErrNoRows {
					http.Error(w, "failed to verify session", http.StatusInternalServerError)
					return
				}
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), adminIDKey, adminID)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetAdminID(r *http.Request) (int64, bool) {
	value := r.Context().Value(adminIDKey)
	adminID, ok := value.(int64)
	return adminID, ok
}
