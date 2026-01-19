-- Add missing columns to subjects table

-- Add prerequisites column (stores array of subject IDs)
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS prerequisites TEXT[] DEFAULT '{}';

-- Add status column
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'missing';

-- Update status based on completed field
UPDATE subjects SET status = 'completed' WHERE completed = true;
UPDATE subjects SET status = 'missing' WHERE completed = false;
