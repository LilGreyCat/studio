DROP INDEX IF EXISTS projects_visible_order_idx;

ALTER TABLE projects
    DROP CONSTRAINT IF EXISTS projects_display_order_nonnegative,
    DROP COLUMN IF EXISTS is_visible,
    DROP COLUMN IF EXISTS display_order;
