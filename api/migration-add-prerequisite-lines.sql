-- Migration: Add show_prerequisite_lines column to config table
-- Date: 2026-01-19
-- Description: Adds support for toggling prerequisite connection lines visualization

-- Add the new column to config table
ALTER TABLE config
ADD COLUMN IF NOT EXISTS show_prerequisite_lines BOOLEAN DEFAULT FALSE;

-- Update existing config row if it exists
UPDATE config
SET show_prerequisite_lines = FALSE
WHERE id = 1 AND show_prerequisite_lines IS NULL;

-- Verify the migration
SELECT id, dark_mode, student_name, show_prerequisite_lines
FROM config
WHERE id = 1;
