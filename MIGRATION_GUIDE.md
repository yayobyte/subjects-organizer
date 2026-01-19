# Migration Guide: JSON to Supabase

This guide will help you migrate your existing curriculum data from local JSON files to Supabase.

## Prerequisites

1. ✅ Supabase project created
2. ✅ Database tables created (run `api/init-db.sql` in Supabase SQL Editor)
3. ✅ Supabase credentials ready (URL and anon key)

## Migration Steps

### Option 1: Using the Migration Script (Recommended)

1. **Create a `.env` file** in the project root:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Run the migration script**:

```bash
node scripts/migrate-to-supabase.js
```

The script will:
- Read data from `server/data/curriculum.json` and `server/data/config.json`
- Transform the data to match the database schema
- Upload all subjects and configuration to Supabase
- Verify the migration succeeded

### Option 2: Using Environment Variables

If you don't want to create a `.env` file:

```bash
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_ANON_KEY=your-anon-key \
node scripts/migrate-to-supabase.js
```

## What Gets Migrated

### Configuration
- Dark mode setting
- Student name

### Subjects
- All subject records (ID, name, credits, semester)
- Grades (numeric values only - "Aprobada" strings are skipped)
- Completion status (maps "completed" status to `completed = true`)
- Order (preserves the order from JSON file)

### Status Mapping

The script maps subject statuses as follows:
- `"completed"` → `completed = true`
- `"in-progress"` → `completed = false`
- `"missing"` → `completed = false`

## After Migration

1. **Verify in Supabase Dashboard**:
   - Go to Table Editor
   - Check `subjects` table has all your records
   - Check `config` table has your settings

2. **Test the application**:
   - Deploy to Vercel (or test locally with `vercel dev`)
   - Verify all subjects appear correctly
   - Test editing a subject to ensure database updates work

3. **Optional: Backup JSON files**:
   ```bash
   # Keep a backup of your original data
   cp server/data/curriculum.json server/data/curriculum.backup.json
   cp server/data/config.json server/data/config.backup.json
   ```

## Troubleshooting

### Error: Missing environment variables

Make sure you have set `SUPABASE_URL` and `SUPABASE_ANON_KEY` either:
- In a `.env` file in the project root
- As environment variables when running the command

### Error: Table does not exist

Make sure you've run the SQL schema in Supabase:
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `api/init-db.sql`
3. Click "Run"

### Error: Row Level Security

If you get permission errors, you may need to disable RLS (Row Level Security) in Supabase:

```sql
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE config DISABLE ROW LEVEL SECURITY;
```

Run this in Supabase SQL Editor.

Alternatively, create policies to allow public access (for personal projects):

```sql
-- Allow all operations on subjects
CREATE POLICY "Allow all on subjects" ON subjects FOR ALL USING (true);

-- Allow all operations on config
CREATE POLICY "Allow all on config" ON config FOR ALL USING (true);
```

## Migration Output Example

```
🚀 Starting migration to Supabase...

📖 Reading local JSON files...
   Found 65 subjects
   Student: Cristian Gutierrez Gonzalez

⚙️  Migrating configuration...
✅ Configuration migrated successfully

📚 Migrating subjects...
   Clearing existing subjects...
   Inserting subjects 1-65...
✅ Successfully migrated 65 subjects

🔍 Verifying migration...
   ✓ Found 65 subjects in database
   ✓ Config student name: Cristian Gutierrez Gonzalez

✅ Migration completed successfully!

📝 Summary:
   - Subjects migrated: 65
   - Configuration: Cristian Gutierrez Gonzalez
   - Dark mode: disabled
```

## Re-running the Migration

The script is safe to run multiple times. It will:
1. Clear all existing subjects before inserting
2. Upsert the configuration (update if exists, insert if not)

This means you can run it again if you make changes to your local JSON files and want to re-sync.
