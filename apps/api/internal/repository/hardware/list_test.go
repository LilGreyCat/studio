package hardware

import (
	"context"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestListVisibleReturnsItemsInDatabaseOrder(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	query := regexp.QuoteMeta(`
		SELECT
			id,
			slug,
			eyebrow,
			title,
			description,
			image_url,
			image_width,
			image_height,
			display_order,
			is_visible,
			created_at,
			updated_at
		FROM hardware_items
		WHERE is_visible
		ORDER BY display_order, id;
	`)

	rows := sqlmock.NewRows([]string{
		"id", "slug", "eyebrow", "title", "description", "image_url",
		"image_width", "image_height", "display_order", "is_visible",
		"created_at", "updated_at",
	}).
		AddRow(2, "soundcard", "Interface principale", "Carte Son", "Description", "/soundcard.jpg", 1920, 1920, 2, true, now, now).
		AddRow(5, "mic2", "Micro 2", "Micro Neumann U87", "Description", "/mic2.jpg", 600, 600, 5, true, now, now)

	mock.ExpectQuery(query).WillReturnRows(rows)

	items, err := New(db).ListVisible(context.Background())
	if err != nil {
		t.Fatal(err)
	}

	if len(items) != 2 {
		t.Fatalf("got %d items, want 2", len(items))
	}
	if items[0].Slug != "soundcard" || items[0].DisplayOrder != 2 {
		t.Fatalf("unexpected first item: %+v", items[0])
	}
	if items[1].Slug != "mic2" || items[1].DisplayOrder != 5 {
		t.Fatalf("unexpected second item: %+v", items[1])
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}

func TestListVisibleReturnsEmptySlice(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	mock.ExpectQuery("FROM hardware_items").WillReturnRows(
		sqlmock.NewRows([]string{
			"id", "slug", "eyebrow", "title", "description", "image_url",
			"image_width", "image_height", "display_order", "is_visible",
			"created_at", "updated_at",
		}),
	)

	items, err := New(db).ListVisible(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if items == nil || len(items) != 0 {
		t.Fatalf("got %#v, want a non-nil empty slice", items)
	}
}
