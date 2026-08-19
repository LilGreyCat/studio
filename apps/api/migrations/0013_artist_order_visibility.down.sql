DROP INDEX IF EXISTS artists_visible_order_idx;
ALTER TABLE artists
    DROP CONSTRAINT IF EXISTS artists_display_order_nonnegative,
    DROP COLUMN IF EXISTS is_visible,
    DROP COLUMN IF EXISTS display_order;
