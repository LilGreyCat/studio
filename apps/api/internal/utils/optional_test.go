package utils

import (
	"encoding/json"
	"testing"
)

func TestOptionalUnmarshalJSON(t *testing.T) {
	var request struct {
		Omitted Optional[string] `json:"omitted"`
		Null    Optional[string] `json:"null"`
		Value   Optional[string] `json:"value"`
	}

	if err := json.Unmarshal([]byte(`{"null":null,"value":"cover.jpg"}`), &request); err != nil {
		t.Fatal(err)
	}

	if request.Omitted.Set {
		t.Error("omitted field was marked as set")
	}
	if !request.Null.Set || request.Null.Value != nil {
		t.Error("null field was not preserved as explicit null")
	}
	if !request.Value.Set || request.Value.Value == nil || *request.Value.Value != "cover.jpg" {
		t.Error("string field value was not preserved")
	}
}
