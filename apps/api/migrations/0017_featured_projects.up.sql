ALTER TABLE projects
    ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX projects_visible_featured_order_idx
    ON projects (is_featured DESC, display_order, id)
    WHERE is_visible;
