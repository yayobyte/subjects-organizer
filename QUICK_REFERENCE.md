# Quick Reference Guide

## 🚀 For New AI Context

**IMPORTANT**: This project uses **Supabase PostgreSQL** database, NOT local JSON files or Vercel Postgres.

### Tech Stack Summary
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Auth**: Supabase Auth (Email/Password)
- **Database**: Supabase (PostgreSQL) + Row Level Security (RLS)
- **Deployment**: Vercel (Static Frontend)
- **State**: React Context API (Auth, Subject, Config)

### Database Tables

**`subjects`** table:
- `id` (TEXT): Subject code
- `user_id` (UUID, PK): Link to `auth.users`
- `name` (TEXT): Subject name
- `credits` (INTEGER): Credit hours
- `semester` (TEXT): e.g., "Semestre 1"
- `grade` (REAL): Numeric grade
- `status` (TEXT): 'completed' | 'in-progress' | 'missing' | 'current'
- `prerequisites` (TEXT[]): Array of prerequisite subject IDs

**`config`** table:
- `user_id` (UUID, PK): Link to `auth.users`
- `dark_mode` (BOOLEAN): Dark mode preference
- `student_name` (TEXT): Student's name
- `show_prerequisite_lines` (BOOLEAN): Connection lines visibility

### API Integration
Communication is **direct via the Supabase Client SDK**.

- `supabase.from('subjects').select('*')`
- `supabase.from('config').maybeSingle()`
- `supabase.auth.signInWithPassword(...)`
- `supabase.auth.signUp(...)`

### Environment Variables

Required in `.env.local` (local) and Vercel Dashboard (production):

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Development Commands

```bash
npm run dev          # Start local development
npm run build        # Build for production (optimized)
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

1. **Architecture**: Client-direct to Supabase (no server functions)
2. **Security**: Row Level Security (RLS) handles user data isolation
3. **Prerequisites**: Stored as PostgreSQL `TEXT[]` array
4. **Auth**: Handled via `AuthContext.tsx`
5. **Auto-save**: Local state updates instantly, background DB save debounced
6. **Smart Fallback**: New accounts receive default curriculum from `curriculum.json` automatically

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

---
[ **Back to README** ](README.md) | [ **Project Setup** ](PROJECT_SETUP.md) | [ **Architecture** ](ARCHITECTURE.md) | [ **Deployment** ](DEPLOYMENT.md)
