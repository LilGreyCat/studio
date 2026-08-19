package notification

import (
	"testing"
	"time"
)

func TestNormalize(t *testing.T) {
	start := time.Now().UTC()
	tests := []struct {
		name    string
		request Write
		wantErr bool
	}{
		{
			name:    "valid scheduled notification",
			request: Write{Message: "  Nouvel album  ", TargetURL: " https://example.com/album ", StartsAt: start, EndsAt: start.Add(time.Hour)},
		},
		{
			name:    "rejects unsafe URL scheme",
			request: Write{Message: "Message", TargetURL: "javascript:alert(1)", StartsAt: start, EndsAt: start.Add(time.Hour)},
			wantErr: true,
		},
		{
			name:    "rejects reversed schedule",
			request: Write{Message: "Message", TargetURL: "https://example.com", StartsAt: start, EndsAt: start.Add(-time.Hour)},
			wantErr: true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			err := Normalize(&test.request)
			if (err != nil) != test.wantErr {
				t.Fatalf("Normalize() error = %v, wantErr %v", err, test.wantErr)
			}
		})
	}
}
