-- Master Migration Script
-- Description: Runs all migrations in the correct order for initial setup
-- Date: 2026-01-19

-- Step 1: Initialize database schema
\i init-db.sql

-- Step 2: Add prerequisites and status columns
\i fix-schema.sql

-- Step 3: Add prerequisite lines toggle to config
\i migration-add-prerequisite-lines.sql

-- Step 4: Initialize order_index values
\i migration-initialize-order-index.sql

-- Verify all migrations
SELECT 'Database migrations completed!' as status;

-- Show current state
SELECT COUNT(*) as total_subjects FROM subjects;
SELECT semester, COUNT(*) as count, MIN(order_index) as min_order, MAX(order_index) as max_order
FROM subjects
GROUP BY semester
ORDER BY semester;
