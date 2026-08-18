package hardware

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestNormalizeCreate(t *testing.T) {
	request := Create{
		Slug:        "  sound-card  ",
		Eyebrow:     "  Interface  ",
		Title:       "  Apollo Twin  ",
		Description: "  Description  ",
		ImageURL:    "  /uploads/hardware/apollo.webp  ",
		ImageWidth:  1200,
		ImageHeight: 800,
	}
	if err := NormalizeCreate(&request); err != nil {
		t.Fatal(err)
	}
	if request.Slug != "sound-card" || request.Title != "Apollo Twin" ||
		request.ImageURL != "/uploads/hardware/apollo.webp" {
		t.Fatalf("request was not normalized: %+v", request)
	}
}

func TestNormalizeCreateRejectsUnsafeImagePath(t *testing.T) {
	request := Create{
		Slug: "sound-card", Eyebrow: "Interface", Title: "Apollo",
		Description: "Description", ImageURL: "/uploads/../secret.txt",
		ImageWidth: 100, ImageHeight: 100,
	}
	if err := NormalizeCreate(&request); err == nil {
		t.Fatal("unsafe image path was accepted")
	}
}

func TestNormalizePatchPreservesFalse(t *testing.T) {
	var request Patch
	if err := json.NewDecoder(strings.NewReader(`{"is_visible":false}`)).Decode(&request); err != nil {
		t.Fatal(err)
	}
	if err := NormalizePatch(&request); err != nil {
		t.Fatal(err)
	}
	if !request.IsVisible.Set || request.IsVisible.Value == nil || *request.IsVisible.Value {
		t.Fatalf("false visibility was not preserved: %+v", request.IsVisible)
	}
}

func TestNormalizePatchRejectsNullRequiredField(t *testing.T) {
	var request Patch
	if err := json.NewDecoder(strings.NewReader(`{"title":null}`)).Decode(&request); err != nil {
		t.Fatal(err)
	}
	if err := NormalizePatch(&request); err == nil {
		t.Fatal("null title was accepted")
	}
}

func TestValidateReorder(t *testing.T) {
	if err := ValidateReorder(Reorder{IDs: []int64{3, 1, 2}}); err != nil {
		t.Fatal(err)
	}
	if err := ValidateReorder(Reorder{IDs: []int64{1, 1}}); err == nil {
		t.Fatal("duplicate identifiers were accepted")
	}
	if err := ValidateReorder(Reorder{IDs: []int64{0}}); err == nil {
		t.Fatal("non-positive identifier was accepted")
	}
}
