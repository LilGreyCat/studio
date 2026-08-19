ALTER TABLE projects
    ADD COLUMN display_order SMALLINT,
    ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT TRUE;

WITH ordered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id DESC)::SMALLINT AS position
    FROM projects
)
UPDATE projects
SET display_order = ordered.position
FROM ordered
WHERE projects.id = ordered.id;

ALTER TABLE projects
    ALTER COLUMN display_order SET NOT NULL,
    ADD CONSTRAINT projects_display_order_nonnegative CHECK (display_order >= 0);

CREATE INDEX projects_visible_order_idx
    ON projects (display_order, id)
    WHERE is_visible;
