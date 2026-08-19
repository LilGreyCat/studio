package notification

import (
	"errors"
	"net/url"
	"strings"
	"time"
)

type Write struct {
	Message   string    `json:"message"`
	TargetURL string    `json:"target_url"`
	StartsAt  time.Time `json:"starts_at"`
	EndsAt    time.Time `json:"ends_at"`
}

func Normalize(request *Write) error {
	request.Message = strings.TrimSpace(request.Message)
	request.TargetURL = strings.TrimSpace(request.TargetURL)
	if request.Message == "" || len(request.Message) > 500 {
		return errors.New("message must contain between 1 and 500 characters")
	}
	if len(request.TargetURL) > 2048 {
		return errors.New("notification URL is too long")
	}
	parsed, err := url.ParseRequestURI(request.TargetURL)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.Host == "" {
		return errors.New("notification URL must be a valid HTTP or HTTPS URL")
	}
	if request.StartsAt.IsZero() || request.EndsAt.IsZero() || !request.EndsAt.After(request.StartsAt) {
		return errors.New("end date must be later than start date")
	}
	return nil
}
