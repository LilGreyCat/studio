package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

const maxJSONBodyBytes = 1 << 20

func DecodeJSON(r *http.Request, dest any) error {
	decoder := json.NewDecoder(io.LimitReader(r.Body, maxJSONBodyBytes+1))
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(dest); err != nil {
		return fmt.Errorf("decode JSON body: %w", err)
	}

	if decoder.InputOffset() > maxJSONBodyBytes {
		return errors.New("JSON body exceeds 1 MiB limit")
	}

	var trailing any
	if err := decoder.Decode(&trailing); !errors.Is(err, io.EOF) {
		if err == nil {
			return errors.New("JSON body must contain a single value")
		}
		return fmt.Errorf("decode trailing JSON data: %w", err)
	}

	return nil
}
