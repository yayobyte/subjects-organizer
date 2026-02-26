# Local Development Guide

## Setup

Your project is now configured to run with Supabase locally using Vercel Dev.

### Prerequisites

- Vercel CLI installed globally: `npm i -g vercel`
- `.env.local` file with Supabase credentials (already created)

## Running Locally

```bash
npm run dev
```

This starts:
- **Frontend**: React app with Vite
- **API**: Serverless functions from `/api` directory
- **Database**: Connected to your Supabase cloud database

The app will be available at: **http://localhost:3000**

## How It Works

- `vercel dev` reads environment variables from `.env.local`
- Your serverless functions in `/api` run locally
- The frontend makes requests to `/api/*` which are handled by the local serverless functions
- The functions connect to your Supabase cloud database

## Environment Variables

Located in `.env.local`:
```
SUPABASE_URL=https://mkjzxaunzcgubuaplptq.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

These are automatically loaded by Vercel Dev.

## Troubleshooting

### Port already in use
If port 3000 is busy, Vercel will automatically use the next available port.

### API requests failing
1. Check that `.env.local` exists and has correct credentials
2. Verify your Supabase project is active
3. Check Supabase dashboard for any Row Level Security (RLS) policies blocking access

### Cannot connect to Supabase
Make sure RLS is disabled or policies are set to allow public access:
```sql
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE config DISABLE ROW LEVEL SECURITY;
```

Run this in Supabase SQL Editor if needed.
