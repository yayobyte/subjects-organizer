-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    semester TEXT NOT NULL,
    grade REAL,
    completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0
);

-- Create config table
CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    dark_mode BOOLEAN DEFAULT FALSE,
    student_name TEXT DEFAULT 'Cristian Gutierrez Gonzalez',
    CHECK (id = 1)
);

-- Insert default config if not exists
INSERT INTO config (id, dark_mode, student_name)
VALUES (1, false, 'Cristian Gutierrez Gonzalez')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON subjects(semester);
CREATE INDEX IF NOT EXISTS idx_subjects_completed ON subjects(completed);
