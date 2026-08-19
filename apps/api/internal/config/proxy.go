package config

import (
	"fmt"
	"net/netip"
	"strings"
)

func ParseTrustedProxyCIDRs(value string) ([]netip.Prefix, error) {
	if strings.TrimSpace(value) == "" {
		return nil, nil
	}

	parts := strings.Split(value, ",")
	prefixes := make([]netip.Prefix, 0, len(parts))
	for _, part := range parts {
		text := strings.TrimSpace(part)
		prefix, err := netip.ParsePrefix(text)
		if err != nil {
			return nil, fmt.Errorf("TRUSTED_PROXY_CIDRS contains invalid CIDR %q", text)
		}
		prefixes = append(prefixes, prefix)
	}
	return prefixes, nil
}
