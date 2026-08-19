ALTER TABLE artists
    ADD COLUMN display_order SMALLINT,
    ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT TRUE;

WITH ordered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id DESC)::SMALLINT AS position
    FROM artists
)
UPDATE artists SET display_order = ordered.position
FROM ordered WHERE artists.id = ordered.id;

ALTER TABLE artists
    ALTER COLUMN display_order SET NOT NULL,
    ADD CONSTRAINT artists_display_order_nonnegative CHECK (display_order >= 0);

CREATE INDEX artists_visible_order_idx ON artists (display_order, id) WHERE is_visible;
