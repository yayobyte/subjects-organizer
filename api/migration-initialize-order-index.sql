-- Migration: Initialize order_index for all existing subjects
-- Date: 2026-01-19
-- Description: Sets order_index based on current database order, partitioned by semester

-- Update order_index for all subjects using ROW_NUMBER() within each semester
WITH ranked_subjects AS (
    SELECT
        id,
        ROW_NUMBER() OVER (PARTITION BY semester ORDER BY id) - 1 as new_order
    FROM subjects
)
UPDATE subjects
SET order_index = ranked_subjects.new_order
FROM ranked_subjects
WHERE subjects.id = ranked_subjects.id;

-- Verify the migration
SELECT semester, id, order_index
FROM subjects
ORDER BY semester, order_index;
