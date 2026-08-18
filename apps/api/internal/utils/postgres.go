package utils

import (
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
)

func IsForeignKeyViolation(err error) bool {
	var postgresError *pgconn.PgError
	return errors.As(err, &postgresError) && postgresError.Code == "23503"
}
