package middleware

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/auth"
)

type sessionStoreStub struct {
	adminID int64
	err     error
}

func (store sessionStoreStub) GetSessionAdminID(context.Context, []byte, time.Time) (int64, error) {
	return store.adminID, store.err
}

func TestAdminAuthRequiresActiveDatabaseSession(t *testing.T) {
	const secret = "test-session-secret"
	token, err := auth.GenerateSessionToken()
	if err != nil {
		t.Fatal(err)
	}

	tests := []struct {
		name       string
		store      sessionStoreStub
		wantStatus int
	}{
		{name: "active", store: sessionStoreStub{adminID: 42}, wantStatus: http.StatusNoContent},
		{name: "revoked", store: sessionStoreStub{err: sql.ErrNoRows}, wantStatus: http.StatusUnauthorized},
		{name: "database failure", store: sessionStoreStub{err: errors.New("database unavailable")}, wantStatus: http.StatusInternalServerError},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			handler := AdminAuth(test.store, secret)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if id, ok := GetAdminID(r); !ok || id != 42 {
					t.Fatalf("admin context = %d, %v", id, ok)
				}
				w.WriteHeader(http.StatusNoContent)
			}))
			request := httptest.NewRequest(http.MethodGet, "/admin/me", nil)
			request.AddCookie(&http.Cookie{Name: "admin_session", Value: token})
			response := httptest.NewRecorder()
			handler.ServeHTTP(response, request)
			if response.Code != test.wantStatus {
				t.Fatalf("status = %d, want %d", response.Code, test.wantStatus)
			}
		})
	}
}
