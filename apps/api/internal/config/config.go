package config

import (
	"errors"
	"net/url"
	"os"
	"strconv"
)

const minimumAuthSecretBytes = 32

type Config struct {
	Port              string
	DatabaseUrl       string
	AuthSecret        string
	FrontendUrl       string
	CookieSecure      bool
	TrustedProxyCIDRs string
}

// Load returns a Config object from environment variables.
// If the environment variable "API_PORT" is empty, it defaults to "8080".
// The other environment variables are "DATABASE_URL", "AUTH_SECRET" and "FRONTEND_URL".
func Load() Config {
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	cookieSecure, _ := strconv.ParseBool(os.Getenv("COOKIE_SECURE"))

	return Config{
		Port:              port,
		DatabaseUrl:       os.Getenv("DATABASE_URL"),
		AuthSecret:        os.Getenv("AUTH_SECRET"),
		FrontendUrl:       os.Getenv("FRONTEND_URL"),
		CookieSecure:      cookieSecure,
		TrustedProxyCIDRs: os.Getenv("TRUSTED_PROXY_CIDRS"),
	}
}

// ValidateAPI rejects missing or unsafe configuration before the HTTP server
// starts accepting requests.
func (cfg Config) ValidateAPI() error {
	if cfg.DatabaseUrl == "" {
		return errors.New("DATABASE_URL is required")
	}

	if len([]byte(cfg.AuthSecret)) < minimumAuthSecretBytes {
		return errors.New("AUTH_SECRET must be at least 32 bytes")
	}

	frontendURL, err := url.ParseRequestURI(cfg.FrontendUrl)
	if err != nil || frontendURL.Host == "" ||
		(frontendURL.Scheme != "http" && frontendURL.Scheme != "https") ||
		frontendURL.Path != "" || frontendURL.RawQuery != "" ||
		frontendURL.Fragment != "" {
		return errors.New("FRONTEND_URL must be an HTTP(S) origin without a path")
	}

	if frontendURL.Scheme == "https" && !cfg.CookieSecure {
		return errors.New("COOKIE_SECURE must be true when FRONTEND_URL uses HTTPS")
	}

	if _, err := ParseTrustedProxyCIDRs(cfg.TrustedProxyCIDRs); err != nil {
		return err
	}

	return nil
}
