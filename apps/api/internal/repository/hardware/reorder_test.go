package hardware

import (
	"context"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestReorderUsesOneGuardedStatement(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	ids := []int64{2, 1}
	mock.ExpectQuery("WITH requested AS").WithArgs("[2,1]").WillReturnRows(
		sqlmock.NewRows([]string{
			"id", "slug", "eyebrow", "title", "description", "image_url",
			"image_width", "image_height", "display_order", "is_visible",
			"created_at", "updated_at",
		}).
			AddRow(2, "second", "Second", "Second", "Second", "/matos/second.jpg", 100, 100, 1, true, now, now).
			AddRow(1, "first", "First", "First", "First", "/matos/first.jpg", 100, 100, 2, true, now, now),
	)

	items, err := New(db).Reorder(context.Background(), ids)
	if err != nil {
		t.Fatal(err)
	}
	if len(items) != 2 || items[0].ID != 2 || items[0].DisplayOrder != 1 ||
		items[1].ID != 1 || items[1].DisplayOrder != 2 {
		t.Fatalf("unexpected reordered items: %+v", items)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
