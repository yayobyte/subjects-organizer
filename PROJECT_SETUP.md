# Project Setup Documentation

## Overview

Visual Curriculum & Prerequisite Tracker - A modern web application for tracking academic progress with real-time database sync using Supabase and Vercel serverless functions.

**Last Updated**: January 19, 2026

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **State Management**: React Context API
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **API**: Vercel Serverless Functions (TypeScript)
- **Client**: @supabase/supabase-js v2.90.1
- **Deployment**: Vercel

## Project Structure

```
├── api/                          # Vercel Serverless Functions
│   ├── curriculum.ts            # GET/POST curriculum data
│   ├── config.ts                # GET/POST/PATCH user config
│   ├── health.ts                # Health check endpoint
│   ├── init-db.sql              # Database schema
│   └── tsconfig.json            # TypeScript config for API
│
├── src/                         # React Frontend
│   ├── components/              # UI Components
│   │   ├── DarkModeToggle.tsx
│   │   ├── Layout.tsx
│   │   ├── PrerequisiteEditor.tsx
│   │   ├── SemesterListView.tsx
│   │   ├── SubjectCard.tsx
│   │   └── StudentNameEditor.tsx
│   ├── contexts/                # React Context
│   │   ├── ConfigContext.tsx
│   │   └── SubjectContext.tsx
│   ├── lib/                     # Utilities
│   │   ├── configStorage.ts    # Config API client
│   │   └── storage.ts          # Curriculum API client
│   ├── data.ts                 # Prerequisites map
│   ├── types.ts                # TypeScript types
│   └── App.tsx                 # Main component
│
├── scripts/                     # Utility Scripts
│   ├── check-supabase-data.js
│   ├── remigrate-with-prerequisites.js
│   └── fix-schema.sql
│
├── public/                      # Static Assets
├── dist/                        # Build Output
│
├── .env                        # Supabase credentials (local)
├── .env.local                  # Same (Vercel pulls from here)
├── vercel.json                 # Vercel configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript configuration
```

## Database Schema (Supabase PostgreSQL)

### Table: `subjects`
```sql
CREATE TABLE subjects (
    id TEXT PRIMARY KEY,                    -- Subject ID (e.g., "IS304")
    name TEXT NOT NULL,                     -- Subject name
    credits INTEGER NOT NULL,               -- Credit hours
    semester TEXT NOT NULL,                 -- Semester (e.g., "Semestre 1")
    grade REAL,                            -- Numeric grade (nullable)
    status TEXT DEFAULT 'missing',         -- completed | in-progress | missing | current
    completed BOOLEAN DEFAULT FALSE,        -- Quick completion flag
    order_index INTEGER DEFAULT 0,          -- Display order
    prerequisites TEXT[] DEFAULT '{}'       -- Array of prerequisite subject IDs
);

CREATE INDEX idx_subjects_semester ON subjects(semester);
CREATE INDEX idx_subjects_completed ON subjects(completed);
```

### Table: `config`
```sql
CREATE TABLE config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    dark_mode BOOLEAN DEFAULT FALSE,
    student_name TEXT DEFAULT 'Cristian Gutierrez Gonzalez',
    CHECK (id = 1)  -- Ensures only one config row
);
```

**Important**: Row Level Security (RLS) must be disabled or set to allow public access:
```sql
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE config DISABLE ROW LEVEL SECURITY;
```

## API Endpoints

All endpoints are serverless functions in `/api`:

### GET `/api/curriculum`
Returns all subjects with prerequisites and status.

**Response:**
```json
{
  "subjects": [
    {
      "id": "IS304",
      "name": "Estructura de Datos",
      "credits": 4,
      "semester": "Semestre 3",
      "grade": 3.1,
      "status": "completed",
      "prerequisites": ["IS284", "IS142"]
    }
  ],
  "studentName": ""
}
```

### POST `/api/curriculum`
Saves all subjects (replaces all existing data).

**Request Body:**
```json
{
  "subjects": [
    {
      "id": "IS304",
      "name": "Estructura de Datos",
      "credits": 4,
      "semester": "Semestre 3",
      "status": "completed",
      "grade": 3.1,
      "prerequisites": ["IS284", "IS142"]
    }
  ]
}
```

### GET `/api/config`
Returns user configuration.

**Response:**
```json
{
  "darkMode": false,
  "studentName": "Cristian Gutierrez Gonzalez"
}
```

### POST `/api/config`
Saves entire configuration.

### PATCH `/api/config`
Partially updates configuration.

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T..."
}
```

## Environment Variables

### Local Development (`.env` or `.env.local`)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

### Vercel Production
Add these in Vercel Dashboard → Settings → Environment Variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Make sure to add them for all environments: Production, Preview, and Development.

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd assignments
npm install
```

### 2. Setup Supabase

1. Go to https://supabase.com and create a project
2. Go to SQL Editor and run `api/init-db.sql`
3. Disable RLS on both tables (or create public access policies)
4. Get credentials from Settings → API:
   - Project URL
   - anon/public key

### 3. Configure Environment Variables

Create `.env.local`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Local Development

```bash
npm run dev:vercel
```

This starts:
- Vite dev server (React app)
- Vercel serverless functions locally
- Available at: http://localhost:3000

**Note**: Regular `npm run dev` only starts Vite without API functions.

### 5. Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically happens on push to main/master

## Data Migration

If you have existing data in JSON format:

1. Place `curriculum.json` in project root or `server/data/`
2. Run migration script:
```bash
node scripts/remigrate-with-prerequisites.js
```

This will:
- Clear existing data
- Import all subjects with prerequisites
- Map status correctly (completed/in-progress/missing)
- Import grades (numeric only, skips "Aprobada" strings)

## Key Features

### Frontend Features
- ✅ Drag & Drop subject reordering between semesters
- ✅ One-click status toggle (Missing → In Progress → Completed)
- ✅ Inline editing (names, credits, grades, prerequisites)
- ✅ Dark mode with cross-device sync
- ✅ Editable student name
- ✅ Real-time GPA and progress statistics
- ✅ Prerequisite locking (can't complete without prerequisites)
- ✅ Visual prerequisite indicators
- ✅ Responsive design (desktop & mobile)

### Backend Features
- ✅ PostgreSQL database via Supabase
- ✅ Serverless API via Vercel Functions
- ✅ Real-time data sync across devices
- ✅ Automatic CORS handling
- ✅ Type-safe API with TypeScript
- ✅ Error handling and validation

## Development Commands

```bash
npm run dev           # Start Vite dev server only (no API)
npm run dev:vercel    # Start Vite + Vercel Functions (with API)
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

## Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables created (`init-db.sql`)
- [ ] RLS disabled or policies set
- [ ] Data migrated (if applicable)
- [ ] Environment variables added to Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Test all features in production

## Troubleshooting

### No data appears
1. Check browser console for errors
2. Check Supabase dashboard - is data there?
3. Verify RLS is disabled: `ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;`
4. Check environment variables in Vercel dashboard

### API returns source code instead of JSON
- Vercel needs `api/tsconfig.json` to transpile TypeScript
- File is included in project, but verify it exists

### Local development can't connect to API
- Use `npm run dev:vercel` not `npm run dev`
- Check `.env.local` has correct credentials
- Ensure Vercel CLI is installed: `npm i -g vercel`

### Prerequisites not showing
- Run `scripts/fix-schema.sql` in Supabase SQL Editor
- Re-migrate data with `scripts/remigrate-with-prerequisites.js`

## Important Notes

1. **Database**: Uses Supabase PostgreSQL (cloud-hosted), NOT local JSON files
2. **API**: Vercel Serverless Functions, NOT Express server
3. **Local Dev**: Must use `npm run dev:vercel` to test with API
4. **Prerequisites**: Stored as PostgreSQL array column `TEXT[]`
5. **Status Field**: Required field - `completed`, `in-progress`, `missing`, or `current`
6. **No Express**: The old Express server (`server/index.js`) was removed
7. **No JSON Files**: Data is stored in Supabase, not in JSON files

## Support

For issues or questions:
- Check DEPLOYMENT.md for deployment guide
- Check LOCAL_DEV.md for local development guide
- Review API endpoint documentation above
- Check Supabase logs for database errors
- Check Vercel logs for function errors
