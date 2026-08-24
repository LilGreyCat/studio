DROP INDEX IF EXISTS projects_visible_featured_order_idx;

ALTER TABLE projects
    DROP COLUMN IF EXISTS is_featured;
