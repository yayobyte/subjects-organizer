# Local Development Guide

This project has two different backend setups:

## Local Development (JSON Files)
- Uses Express server in `server/index.js`
- Stores data in JSON files (`server/data/`)
- Run with: `npm run dev`

## Production (Supabase Database)
- Uses Vercel serverless functions in `api/`
- Stores data in Supabase PostgreSQL database
- Deployed to Vercel

## Starting Local Development

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

This will start:
- Frontend: http://localhost:5173 (Vite)
- Backend: http://localhost:3001 (Express)

The frontend is configured to proxy `/api/*` requests to the backend during development (see `vite.config.ts`).

## Local Development with Supabase (Optional)

If you want to test with the actual Supabase database locally:

1. Create a `.env.local` file:
```bash
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

2. Use Vercel CLI to run serverless functions locally:
```bash
npm install -g vercel
vercel dev
```

This will run the serverless functions from `/api` instead of the Express server.

## File Structure

```
/server/              # Express server (local dev only)
  /data/              # JSON data files (local dev only)
  index.js            # Express app

/api/                 # Vercel serverless functions (production)
  config.ts           # Config endpoints
  curriculum.ts       # Curriculum endpoints
  health.ts           # Health check
  init-db.sql         # Database schema

/src/                 # React frontend
  /lib/
    storage.ts        # API client (works with both backends)
    configStorage.ts  # Config API client
```

## Key Points

- **Local changes to JSON files are NOT deployed** - they're only for local testing
- **Production uses Supabase** - all data is stored in the cloud database
- The frontend code (`src/lib/storage.ts`) works with both backends seamlessly
- Both backends implement the same API endpoints with the same response format
