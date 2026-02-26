# Local Development Guide

## Setup

- `.env.local` file with Supabase credentials (VITE_ or NEXT_PUBLIC_ prefixes)

## Running Locally

- **Frontend**: React app with Vite
- **Database**: Connected directly to your Supabase cloud database

The app will be available at: **http://localhost:5173** (or the port Vite provides)

- Vite loads environment variables from `.env.local`
- The Supabase client in the frontend uses these variables to connect directly to the cloud.
- `AuthContext` handles the login flow.

## Environment Variables

Located in `.env.local`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

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

---
[ **Back to README** ](README.md) | [ **Quick Reference** ](QUICK_REFERENCE.md) | [ **Project Setup** ](PROJECT_SETUP.md) | [ **Architecture** ](ARCHITECTURE.md)
