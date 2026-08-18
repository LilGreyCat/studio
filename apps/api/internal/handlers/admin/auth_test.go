package admin

import (
	"strings"
	"testing"

	adminRequests "github.com/PtiCadri/studio/apps/api/internal/requests/admin"
)

func TestValidateLoginRequest(t *testing.T) {
	tests := []struct {
		name    string
		request adminRequests.Login
		wantErr bool
	}{
		{
			name: "valid credentials",
			request: adminRequests.Login{
				Email:    "admin@example.com",
				Password: "temporary-password",
			},
		},
		{
			name: "missing email",
			request: adminRequests.Login{
				Password: "temporary-password",
			},
			wantErr: true,
		},
		{
			name: "missing password",
			request: adminRequests.Login{
				Email: "admin@example.com",
			},
			wantErr: true,
		},
		{
			name: "oversized email",
			request: adminRequests.Login{
				Email:    strings.Repeat("a", maximumEmailBytes+1),
				Password: "temporary-password",
			},
			wantErr: true,
		},
		{
			name: "password beyond bcrypt limit",
			request: adminRequests.Login{
				Email:    "admin@example.com",
				Password: strings.Repeat("a", maximumPasswordBytes+1),
			},
			wantErr: true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			err := validateLoginRequest(test.request)
			if (err != nil) != test.wantErr {
				t.Fatalf("validateLoginRequest() error = %v, wantErr %v", err, test.wantErr)
			}
		})
	}
}

func TestDummyPasswordHashIsValid(t *testing.T) {
	if len(dummyPasswordHash) == 0 {
		t.Fatal("dummy password hash is empty")
	}
}
