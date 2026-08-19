package price

import "errors"

var allowedKeys = map[string]struct{}{
	"recording": {}, "mixing": {}, "mastering": {}, "live_setup": {},
	"live_performance": {}, "single": {}, "ep": {}, "album": {},
}

type Item struct {
	Key         string `json:"key"`
	AmountCents int    `json:"amount_cents"`
}

type UpdateAll struct {
	Prices []Item `json:"prices"`
}

func Validate(request UpdateAll) error {
	if len(request.Prices) != len(allowedKeys) {
		return errors.New("all prices must be provided")
	}
	seen := make(map[string]struct{}, len(request.Prices))
	for _, price := range request.Prices {
		if _, allowed := allowedKeys[price.Key]; !allowed {
			return errors.New("unknown price key")
		}
		if _, duplicate := seen[price.Key]; duplicate {
			return errors.New("duplicate price key")
		}
		if price.AmountCents < 0 || price.AmountCents > 100_000_000 {
			return errors.New("price must be between 0 and 1,000,000 euros")
		}
		seen[price.Key] = struct{}{}
	}
	return nil
}
