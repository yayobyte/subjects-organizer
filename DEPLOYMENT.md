# Deployment Guide for Vercel with Supabase

This guide walks you through deploying your Curriculum Tracker application to Vercel with Supabase as the database.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- A Supabase account (sign up at https://supabase.com)
- GitHub repository connected to Vercel

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click **New Project**
3. Fill in the details:
   - **Name**: `curriculum-tracker` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your users
4. Click **Create new project**
5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Set Up Database Tables

1. In your Supabase project dashboard, click on the **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the contents of `api/init-db.sql`:

```sql
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
```

4. Click **Run** to execute the SQL

## Step 3: Get Supabase Credentials

1. In your Supabase project, click on **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. Keep this page open - you'll need these values next

## Step 4: Configure Vercel Environment Variables

1. Go to your Vercel Dashboard (https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variables:

   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | Your Supabase Project URL |
   | `SUPABASE_ANON_KEY` | Your Supabase anon public key |

5. Make sure to add them for all environments: **Production**, **Preview**, and **Development**
6. Click **Save**

## Step 5: Deploy to Vercel

### Automatic Deployment (Recommended)

Simply push to your `master` branch:

```bash
git add .
git commit -m "feat: migrate to Supabase for database storage"
git push origin master
```

Vercel will automatically detect the push and deploy your application.

### Manual Deployment

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel --prod
```

## Step 6: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Check that the app loads correctly
3. Test the dark mode toggle (saves to database)
4. Test editing student name (saves to database)
5. Test adding/editing subjects (saves to database)

## API Endpoints

Your serverless functions will be available at:

- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/config` - Configuration (GET, POST, PATCH)
- `https://your-app.vercel.app/api/curriculum` - Curriculum data (GET, POST)

## Local Development with Supabase

To develop locally with the Supabase database:

1. Create a `.env.local` file in the project root:

```bash
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

2. Start the development server:

```bash
npm run dev
```

The frontend will run on port 5173 (Vite) and make API calls to `/api/*`.

## Supabase Row Level Security (RLS)

By default, Supabase enables RLS (Row Level Security) on tables. For this personal project, you can disable it:

1. Go to **Authentication** → **Policies** in Supabase
2. For the `subjects` table, click **New Policy**
3. Choose **Enable read access for all users** and **Enable insert/update/delete for all users**
4. Repeat for the `config` table

Alternatively, disable RLS entirely (only for personal projects):

```sql
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE config DISABLE ROW LEVEL SECURITY;
```

Run this in the Supabase SQL Editor.

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify environment variables are set correctly in Vercel dashboard
2. Check that your Supabase project is active
3. Ensure RLS policies allow public access (see above)
4. Check the Vercel logs: `vercel logs`

### Build Failures

If the build fails:

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compiles locally: `npm run build`

### API Route Issues

If API routes return 404:

1. Verify `vercel.json` is in the repository root
2. Check that files are in the `/api` directory
3. Ensure files have `.ts` or `.js` extension

### CORS Errors

If you see CORS errors in the browser console:

1. Check that the API routes include CORS headers (they should already)
2. Verify the frontend is making requests to the correct domain

## Cost Considerations

- **Vercel Hobby Plan**: Free tier includes:
  - 100 GB bandwidth/month
  - Serverless function executions

- **Supabase Free Tier**: Includes:
  - 500 MB database storage
  - 5 GB bandwidth/month
  - 2 GB file storage
  - More than sufficient for personal projects

Both services are completely free for personal projects within these limits.

## Next Steps

- Set up a custom domain (optional)
- Enable Vercel Analytics
- Set up monitoring and alerts
- Configure automatic database backups in Supabase
- Add authentication if needed (Supabase has built-in auth)
