# Architecture Documentation

## System Architecture Overview

This is a **full-stack React application** with a **Supabase PostgreSQL database** and **Vercel serverless functions** for the API layer.

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                     (React + TypeScript)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS
                       │ /api/* requests
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Serverless Functions (/api)                        │   │
│  │  - curriculum.ts (GET/POST subjects)                │   │
│  │  - config.ts (GET/POST/PATCH config)                │   │
│  │  - health.ts (health check)                         │   │
│  └────────────────────┬────────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ Supabase Client SDK
                        │ @supabase/supabase-js
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE (PostgreSQL)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                              │  │
│  │  - subjects (id, name, credits, status, prereqs)     │  │
│  │  - config (dark_mode, student_name)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App.tsx
├── ConfigProvider (ConfigContext.tsx)
│   └── provides: darkMode, studentName, updateConfig()
│
└── SubjectProvider (SubjectContext.tsx)
    ├── provides: subjects[], addSubject(), updateSubject(), deleteSubject()
    │
    └── Layout
        ├── Header
        │   ├── StudentNameEditor
        │   └── DarkModeToggle
        │
        └── SemesterListView
            └── SubjectCard (for each subject)
                ├── PrerequisiteEditor
                ├── Grade editor
                └── Status toggle
```

### State Management

**ConfigContext** (`src/contexts/ConfigContext.tsx`)
- Manages: `darkMode`, `studentName`
- Storage: Supabase `config` table
- API: `/api/config`

**SubjectContext** (`src/contexts/SubjectContext.tsx`)
- Manages: `subjects[]` array
- Storage: Supabase `subjects` table
- API: `/api/curriculum`
- Features: Auto-save (1s debounce), optimistic updates

### Data Flow

1. **Load Data on Mount**
   ```
   Component Mount → Context useEffect → API GET → Update State → Render
   ```

2. **User Action (e.g., edit grade)**
   ```
   User Input → Context Method → Update Local State → Debounced API POST
   ```

3. **Cross-Device Sync**
   ```
   Device A: Update → API POST → Database
   Device B: Refresh → API GET → Latest Data
   ```

## Backend Architecture (Serverless Functions)

### API Function Structure

Each API endpoint is a separate TypeScript file in `/api`:

**Example: `/api/curriculum.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // CORS headers
    // Route by HTTP method (GET/POST)
    // Query Supabase
    // Transform data
    // Return JSON
}
```

### Data Transformation Layer

The API transforms between **database schema** and **frontend schema**:

**Database Format:**
```typescript
{
    id: "IS304",
    name: "Estructura de Datos",
    credits: 4,
    semester: "Semestre 3",
    grade: 3.1,
    status: "completed",
    completed: true,
    order_index: 5,
    prerequisites: ["IS284", "IS142"]  // PostgreSQL array
}
```

**Frontend Format:**
```typescript
{
    id: "IS304",
    name: "Estructura de Datos",
    credits: 4,
    semester: "Semestre 3",
    grade: 3.1,
    status: "completed",
    prerequisites: ["IS284", "IS142"]  // JavaScript array
}
```

The API handles this transformation automatically.

## Database Design

### Prerequisites Implementation

Prerequisites are stored as a **PostgreSQL TEXT[] array**:

```sql
prerequisites TEXT[] DEFAULT '{}'
```

Example data:
```sql
INSERT INTO subjects (id, prerequisites)
VALUES ('IS304', ARRAY['IS284', 'IS142']);
```

Query with prerequisites:
```sql
SELECT * FROM subjects WHERE 'IS284' = ANY(prerequisites);
```

### Why Both `status` AND `completed` Fields?

- **`status`**: Main field used by frontend (`completed`, `in-progress`, `missing`)
- **`completed`**: Boolean for quick filtering in SQL queries
- They're kept in sync: `completed = (status === 'completed')`

This allows:
```sql
-- Fast query using indexed boolean
SELECT * FROM subjects WHERE completed = true;

-- Frontend uses status for UI logic
if (subject.status === 'completed') { ... }
```

## Deployment Architecture

### Vercel Deployment
```
GitHub Repository (master branch)
        ↓
    git push
        ↓
Vercel Auto-Deploy
        ↓
Build: npm run build
        ↓
Deploy: Serverless Functions + Static Assets
        ↓
Production: https://your-app.vercel.app
```

### Environment Variables Flow
```
Local: .env.local → Vercel Dev
Production: Vercel Dashboard → Serverless Functions
```

## Key Design Decisions

### Why Supabase over Other Options?

✅ **Pros:**
- Real PostgreSQL (relational, ACID compliant)
- Free tier sufficient for personal projects
- Built-in authentication (future expansion)
- Real-time subscriptions available
- REST API + client SDK

❌ **Alternatives considered:**
- **Vercel Postgres**: Removed by Vercel
- **Vercel Blob**: Too expensive for frequent reads/writes
- **Local JSON**: No cross-device sync

### Why Vercel Serverless over Express?

✅ **Serverless Pros:**
- No server management
- Auto-scaling
- Free tier generous
- Global edge network
- Zero config deployment

❌ **Express Cons:**
- Requires hosting (VPS, Heroku, etc.)
- Manual scaling
- Always-on costs
- More maintenance

### Why Store Prerequisites in Database?

**Option 1: Hardcoded in Frontend** (`src/data.ts`)
- Fast, no API call
- But: Can't edit via UI
- **Used for:** Static prerequisite map

**Option 2: Store in Database** (current)
- User can edit prerequisites
- Syncs across devices
- **Used for:** User's subject prerequisites

Both coexist: `data.ts` has the official curriculum prerequisites, database stores user's actual prerequisite requirements (can be customized).

## Performance Considerations

### Frontend Optimizations
- **Debounced saves**: 1 second delay before API call
- **Optimistic updates**: UI updates immediately
- **Memoization**: React.useMemo for expensive calculations
- **Lazy loading**: Components loaded on demand

### Backend Optimizations
- **Database indexes**: On `semester` and `completed` fields
- **Batch operations**: Insert multiple subjects in one query
- **Connection pooling**: Supabase handles automatically
- **Edge caching**: Vercel CDN for static assets

### Data Transfer
- **Average subject**: ~200 bytes
- **60 subjects**: ~12 KB
- **Compressed (gzip)**: ~3 KB
- Network overhead: Minimal

## Security Considerations

### Current Security Model

⚠️ **Public Access** (suitable for personal use only)

- RLS disabled: `ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;`
- Anyone with the URL can read/write data
- ANON key is public (visible in frontend code)

### For Production/Multi-User

Would need to add:
1. **Authentication** (Supabase Auth)
2. **Row Level Security** policies
3. **User-specific data isolation**

Example RLS policy:
```sql
CREATE POLICY "Users can only see own subjects"
ON subjects FOR SELECT
USING (auth.uid() = user_id);
```

## Error Handling Strategy

### API Level
```typescript
try {
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) throw error;
    return res.json({ subjects: data });
} catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
        error: 'Database operation failed',
        details: error.message
    });
}
```

### Frontend Level
```typescript
try {
    const response = await fetch('/api/curriculum');
    if (!response.ok) throw new Error('Failed to load');
    return await response.json();
} catch (error) {
    console.error('API error:', error);
    return null; // Use cached/default data
}
```

### User Experience
- Errors logged to console (dev mode)
- User sees graceful fallback
- Data persists in database even if frontend fails

## Monitoring & Debugging

### Development
- Browser console: Frontend errors
- Terminal: Vercel dev server logs
- Network tab: API requests/responses

### Production
- **Vercel Dashboard**: Function logs, errors, performance
- **Supabase Dashboard**: Query logs, slow queries, database size
- **Browser DevTools**: Client-side errors

## Future Scalability

### Current Limits
- **Database**: 500 MB (Supabase free tier)
- **API**: 100 GB bandwidth/month (Vercel free tier)
- **Users**: Single user (no auth)

### Scaling Plan
1. Add authentication → Multi-user support
2. Implement RLS → Data isolation
3. Add caching layer → Redis/KV store
4. Optimize queries → Materialized views
5. Add monitoring → Error tracking service

## Technology Choices Summary

| Component | Technology | Why |
|-----------|-----------|-----|
| Frontend Framework | React 19 | Component-based, mature ecosystem |
| Language | TypeScript | Type safety, better DX |
| Build Tool | Vite | Fast HMR, modern |
| Styling | Tailwind CSS v4 | Utility-first, customizable |
| Database | Supabase (PostgreSQL) | Relational, free tier, managed |
| API | Vercel Serverless | No server mgmt, auto-scale |
| Deployment | Vercel | Git-based, zero config |
| State | React Context | Simple, no redux needed |

## Documentation Map

- **PROJECT_SETUP.md**: Setup and getting started
- **ARCHITECTURE.md**: This file - system design
- **DEPLOYMENT.md**: Deployment guide
- **LOCAL_DEV.md**: Local development
- **README.md**: User-facing features
