# Local Development Guide

## Setup

Your project is now configured to run with Supabase locally using Vercel Dev.

### Prerequisites

- Vercel CLI installed globally: `npm i -g vercel`
- `.env.local` file with Supabase credentials (already created)

## Running Locally

To run the project with both the **Frontend** and the **API Backend** active:

```bash
npm run dev:local
```

This starts a local Vercel environment that:
- **Frontend**: Vite (React) runs on a dynamic port.
- **API**: Serverless functions from `/api` are compiled and served.
- **Proxy**: Everything is combined and made available at **http://localhost:3000**.

> **Note**: Always use `http://localhost:3000` to view the app. If you use the Vite port (usually 5173), the API requests will fail.

## Environment Variables

Located in `.env.local`:
```bash
# Frontend variables (prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Backend variables (required for /api functions)
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

**Crucial**: The backend API requires `SUPABASE_ANON_KEY` without the `NEXT_PUBLIC_` prefix. If it's missing, the subjects will not load.

## Troubleshooting

### Subjects are not loading
1.  **Check the command**: Ensure you are running `npm run dev:local`, not just `npm run dev`.
2.  **Check the URL**: Ensure you are visiting `http://localhost:3000`.
3.  **Check .env.local**: Verify `SUPABASE_ANON_KEY` is present.
4.  **Syntax Error: Unexpected token 'i'**: If you see this in the browser console, it means the API is being served as a static file instead of being executed. This happens if you aren't using port 3000 or if the Vercel dev server failed to detect the functions.

### Port already in use
If port 3000 is busy, Vercel will automatically use the next available port (e.g., 3001). Check the terminal output for the "Available at" message.

### Login required
If `npx vercel dev` asks you to log in, follow the link to authorize your machine so it can fetch the project configuration.
