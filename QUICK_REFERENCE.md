# Quick Reference Guide

## 🚀 For New AI Context

**IMPORTANT**: This project uses **Supabase PostgreSQL** database, NOT local JSON files or Vercel Postgres.

### Tech Stack Summary
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Vercel Serverless Functions (TypeScript)
- **Database**: Supabase (PostgreSQL) - cloud-hosted
- **Deployment**: Vercel
- **State**: React Context API

### Database Tables

**`subjects`** table:
- `id` (TEXT, PK): Subject code
- `name` (TEXT): Subject name
- `credits` (INTEGER): Credit hours
- `semester` (TEXT): e.g., "Semestre 1"
- `grade` (REAL): Numeric grade
- `status` (TEXT): 'completed' | 'in-progress' | 'missing' | 'current'
- `completed` (BOOLEAN): Quick flag
- `order_index` (INTEGER): Display order
- `prerequisites` (TEXT[]): Array of prerequisite subject IDs

**`config`** table:
- `id` (INTEGER, PK): Always 1
- `dark_mode` (BOOLEAN): Dark mode preference
- `student_name` (TEXT): Student's name

### API Endpoints (Serverless)

All in `/api` directory:

- **GET `/api/curriculum`**: Fetch all subjects
- **POST `/api/curriculum`**: Save all subjects
- **GET `/api/config`**: Fetch config
- **POST `/api/config`**: Save entire config
- **PATCH `/api/config`**: Partial config update
- **GET `/api/health`**: Health check

### Environment Variables

Required in `.env.local` (local) and Vercel Dashboard (production):

```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Development Commands

```bash
npm run dev          # Vite only (no API)
npm run dev:vercel   # Vite + Vercel Functions (with API) ← USE THIS
npm run build        # Production build
```

### File Structure

```
/api                 # Serverless functions
  /curriculum.ts     # Subjects CRUD
  /config.ts         # Config CRUD
  /health.ts         # Health check
  /init-db.sql       # Database schema
  /tsconfig.json     # TypeScript config

/src                 # React app
  /components        # UI components
  /contexts          # React Context (state)
  /lib               # API clients
  /data.ts           # Prerequisites map
  /types.ts          # TypeScript types

/scripts             # Utility scripts
  /remigrate-with-prerequisites.js
  /check-supabase-data.js
  /fix-schema.sql

/.env.local          # Local Supabase credentials
/vercel.json         # Vercel configuration
/package.json        # Dependencies
```

### Key Implementation Details

1. **No Express Server**: Uses Vercel Serverless Functions
2. **No Local JSON**: All data in Supabase cloud database
3. **Prerequisites**: Stored as PostgreSQL `TEXT[]` array
4. **Status Field**: Required - used by frontend for UI logic
5. **Color-Coded Cards**: Green (completed), Blue (in-progress), Amber (ready), Red (locked)
6. **Auto-save**: 1 second debounce before API call
7. **RLS Disabled**: Row Level Security disabled for single-user access

### Common Tasks

**Check database data:**
```bash
node scripts/check-supabase-data.js
```

**Migrate data from JSON:**
```bash
node scripts/remigrate-with-prerequisites.js
```

**Add missing columns to database:**
Run `scripts/fix-schema.sql` in Supabase SQL Editor

**Deploy to production:**
```bash
git push origin master  # Auto-deploys via Vercel
```

### Troubleshooting

**No data showing:**
- Check Supabase RLS is disabled: `ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;`
- Verify environment variables in Vercel
- Check browser console for errors

**API returns TypeScript code:**
- Ensure `api/tsconfig.json` exists
- Restart Vercel dev server

**Can't connect locally:**
- Use `npm run dev:vercel` not `npm run dev`
- Check `.env.local` has correct credentials

### Documentation Files

- **PROJECT_SETUP.md**: Complete setup guide
- **ARCHITECTURE.md**: System design and decisions
- **DEPLOYMENT.md**: Step-by-step deployment
- **LOCAL_DEV.md**: Local development setup
- **COLOR_SYSTEM.md**: Color-coded status system documentation
- **README.md**: User-facing features
- **QUICK_REFERENCE.md**: This file

### Data Model

Frontend expects subjects in this format:
```typescript
{
  id: string;
  name: string;
  semester: string;
  credits: number;
  status: 'completed' | 'in-progress' | 'missing' | 'current';
  grade?: number | string;
  prerequisites?: string[];
}
```

Database stores in this format:
```typescript
{
  id: string;
  name: string;
  semester: string;
  credits: number;
  status: string;
  grade: number | null;
  completed: boolean;
  order_index: number;
  prerequisites: string[];  // PostgreSQL array
}
```

API layer handles transformation between these formats.

### Critical Notes

⚠️ **DO NOT**:
- Look for `server/index.js` (removed - was Express server)
- Look for `server/data/*.json` (removed - was local storage)
- Try to use Vercel Postgres (discontinued by Vercel)
- Use `npm run dev` for testing API (won't work)

✅ **DO**:
- Use Supabase for all database operations
- Use `npm run dev:vercel` for local development with API
- Store environment variables in `.env.local` and Vercel Dashboard
- Run migration scripts when database schema changes
- Check both PROJECT_SETUP.md and ARCHITECTURE.md for details
