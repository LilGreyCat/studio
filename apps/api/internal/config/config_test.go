package config

import "testing"

func validConfig() Config {
	return Config{
		DatabaseUrl:  "postgresql://studio:studio@db:5432/studio",
		AuthSecret:   "0123456789abcdef0123456789abcdef",
		FrontendUrl:  "http://localhost:3000",
		CookieSecure: false,
	}
}

func TestValidateAPIAcceptsDevelopmentConfiguration(t *testing.T) {
	cfg := validConfig()
	if err := cfg.ValidateAPI(); err != nil {
		t.Fatalf("ValidateAPI() returned an unexpected error: %v", err)
	}
}

func TestValidateAPIRejectsUnsafeConfiguration(t *testing.T) {
	tests := []struct {
		name   string
		change func(*Config)
	}{
		{
			name: "missing database URL",
			change: func(cfg *Config) {
				cfg.DatabaseUrl = ""
			},
		},
		{
			name: "short authentication secret",
			change: func(cfg *Config) {
				cfg.AuthSecret = "too-short"
			},
		},
		{
			name: "invalid frontend URL",
			change: func(cfg *Config) {
				cfg.FrontendUrl = "localhost:3000"
			},
		},
		{
			name: "frontend URL with path",
			change: func(cfg *Config) {
				cfg.FrontendUrl = "http://localhost:3000/contact"
			},
		},
		{
			name: "insecure cookie over HTTPS",
			change: func(cfg *Config) {
				cfg.FrontendUrl = "https://studio.example.com"
				cfg.CookieSecure = false
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			cfg := validConfig()
			test.change(&cfg)

			if err := cfg.ValidateAPI(); err == nil {
				t.Fatal("ValidateAPI() accepted unsafe configuration")
			}
		})
	}
}

func TestValidateAPIAcceptsSecureCookiesOverHTTPS(t *testing.T) {
	cfg := validConfig()
	cfg.FrontendUrl = "https://studio.example.com"
	cfg.CookieSecure = true

	if err := cfg.ValidateAPI(); err != nil {
		t.Fatalf("ValidateAPI() returned an unexpected error: %v", err)
	}
}
