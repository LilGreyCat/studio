package price

import "testing"

func validRequest() UpdateAll {
	prices := make([]Item, 0, len(allowedKeys))
	for key := range allowedKeys {
		prices = append(prices, Item{Key: key, AmountCents: 1000})
	}
	return UpdateAll{Prices: prices}
}

func TestValidate(t *testing.T) {
	t.Run("accepts every known price", func(t *testing.T) {
		if err := Validate(validRequest()); err != nil {
			t.Fatalf("Validate() error = %v", err)
		}
	})

	t.Run("rejects incomplete updates", func(t *testing.T) {
		request := validRequest()
		request.Prices = request.Prices[:len(request.Prices)-1]
		if err := Validate(request); err == nil {
			t.Fatal("Validate() expected an error")
		}
	})

	t.Run("rejects negative prices", func(t *testing.T) {
		request := validRequest()
		request.Prices[0].AmountCents = -1
		if err := Validate(request); err == nil {
			t.Fatal("Validate() expected an error")
		}
	})
}
