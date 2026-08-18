package admin

import (
	"context"
	"database/sql"
	"errors"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	adminModels "github.com/PtiCadri/studio/apps/api/internal/domain/models"
	adminRequests "github.com/PtiCadri/studio/apps/api/internal/requests/admin"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrFetchAdmin         = errors.New("failed to fetch admin user")
	dummyPasswordHash     = createDummyPasswordHash()
)

const (
	maximumEmailBytes    = 254
	maximumPasswordBytes = 72
)

func createDummyPasswordHash() []byte {
	hash, err := bcrypt.GenerateFromPassword(
		[]byte("not-a-real-admin-password"),
		bcrypt.DefaultCost,
	)
	if err != nil {
		panic("failed to initialize admin authentication")
	}
	return hash
}

func validateLoginRequest(request adminRequests.Login) error {
	if request.Email == "" || request.Password == "" {
		return errors.New("email and password are required")
	}
	if len([]byte(request.Email)) > maximumEmailBytes ||
		len([]byte(request.Password)) > maximumPasswordBytes {
		return errors.New("invalid email or password length")
	}

	return nil
}

func (h Handler) authenticateAdmin(
	ctx context.Context,
	request adminRequests.Login,
) (adminModels.Admin, error) {
	admin, err := h.repo.GetByEmail(ctx, request.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			_ = bcrypt.CompareHashAndPassword(
				dummyPasswordHash,
				[]byte(request.Password),
			)
			return adminModels.Admin{}, ErrInvalidCredentials
		}

		return adminModels.Admin{}, ErrFetchAdmin
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(admin.PasswordHash),
		[]byte(request.Password),
	)
	if err != nil {
		return adminModels.Admin{}, ErrInvalidCredentials
	}

	return admin, nil
}

func handleLoginError(w http.ResponseWriter, err error) {
	switch err {
	case ErrInvalidCredentials:
		http.Error(w, err.Error(), http.StatusUnauthorized)
	case ErrFetchAdmin:
		http.Error(w, err.Error(), http.StatusInternalServerError)
	default:
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}
}
