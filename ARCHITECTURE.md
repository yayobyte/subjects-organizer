# Architecture Documentation

## System Architecture Overview

This is a **pure frontend React application** powered directly by **Supabase**. Authentication is handled via Supabase Auth, and data security is enforced at the database level using **Row Level Security (RLS)**.

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                     (React + TypeScript)                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Application Logic                                  │   │
│  │  - AuthContext.tsx (User session management)        │   │
│  │  - storage.ts (Direct Supabase SDK calls)           │   │
│  │  - configStorage.ts (Direct Supabase SDK calls)     │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Supabase Client SDK (w/ JWT)
                       │ @supabase/supabase-js
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE (PostgreSQL)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services:                                            │  │
│  │  - Supabase Auth (Identity Management)                │  │
│  │  - PostgreSQL DB with RLS (Data isolation)            │  │
│  │                                                       │  │
│  │  Tables:                                              │  │
│  │  - subjects (user_id PK, id, name, credits...)       │  │
│  │  - config (user_id PK, dark_mode, student_name)       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App.tsx
├── AuthProvider (AuthContext.tsx)
│   └── provides: user, session, login(), signUp(), logout()
│
├── ConfigProvider (ConfigContext.tsx)
│   └── provides: darkMode, studentName, showPrerequisiteLines, updateConfig()
│
└── SubjectProvider (SubjectContext.tsx)
    ├── provides: subjects[], addSubject(), updateSubject(), deleteSubject()
    │
    └── Layout (Protected by Auth)
        ├── Auth Screen (if logged out)
        ├── Header
        │   ├── StudentNameEditor
        │   ├── ConnectionLinesToggle
        │   └── DarkModeToggle
...
```

### State Management

**AuthContext** (`src/contexts/AuthContext.tsx`)
- Manages: `user` session, `isLoading`
- Storage: Supabase Auth

**ConfigContext** (`src/contexts/ConfigContext.tsx`)
- Manages: `darkMode`, `studentName`, `showPrerequisiteLines`
- Storage: Supabase `config` table (user-specific via RLS)

**SubjectContext** (`src/contexts/SubjectContext.tsx`)
- Manages: `subjects[]` array
- Storage: Supabase `subjects` table (user-specific via RLS)
- Features: Auto-save (1s debounce), automatic backup fallback
...
   ```
   Sign-in → App Mount → Contexts Fetch → Direct DB Queries → Render
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

We use **Supabase Auth** and the **Supabase JS Client** directly in the browser.

### Authentication Flow
1. User logs in/registers via the `Auth.tsx` component.
2. `supabase.auth.signInWithPassword` returns a JWT token.
3. The Supabase Client automatically attaches this JWT to all subsequent requests.

### Data Isolation
All tables use `user_id` columns linked to `auth.users.id`.
`Row Level Security (RLS)` is enabled to ensure users can only see and edit their own rows.

```sql
CREATE POLICY "user_exclusive_access" ON subjects
FOR ALL USING (auth.uid() = user_id);
```

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

⚠️ **Private Access Enabled**

- RLS enabled: `ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;`
- Users must log in.
- RLS policies ensure data isolation.
- `VITE_SUPABASE_ANON_KEY` is public (standard for Supabase).

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

## Prerequisite Lines Visualization

### Overview
Visual SVG-based connection lines showing prerequisite relationships between subjects.

### Architecture
```
SemesterListView (relative container with .semester-scroll-container class)
  ├── PrerequisiteLines Component
  │   ├── SVG overlay (absolute, full width/height, z-index: 1)
  │   ├── Position calculation (getBoundingClientRect)
  │   ├── Bezier curve generation
  │   └── Animated <path> elements
  └── Subject Cards (data-subject-id attributes)
```

### Implementation Details

**Position Calculation**:
- Uses `querySelector` with `data-subject-id` to find cards
- `getBoundingClientRect()` for precise positioning
- Calculates relative to scroll container bounds
- Accounts for `scrollLeft` to handle horizontal scrolling

**Curve Generation**:
```typescript
M ${from.x} ${from.y}  // Move to prerequisite card right edge
C ${controlPoint1},    // Bezier control point 1
  ${controlPoint2},    // Bezier control point 2
  ${to.x} ${to.y}     // End at subject card left edge
```

**Color Mapping**:
- Green (`emerald-500`): Completed prerequisite
- Teal (`dark-teal-500`): In-progress prerequisite
- Red (`deep-crimson-500`): Missing/locked prerequisite (dashed)

**Performance**:
- Debounced recalculation (100ms) on scroll/resize
- `requestAnimationFrame` for smooth rendering
- Memoized connections array
- Only renders when `config.showPrerequisiteLines === true`

**Animations**:
- Framer Motion `pathLength` animation (0 → 1)
- Fade in/out transitions (300ms)
- Stroke-dashoffset effect for drawing animation

### Database Schema
```sql
ALTER TABLE config
ADD COLUMN show_prerequisite_lines BOOLEAN DEFAULT FALSE;
```

### API Changes
Updated `/api/config` endpoints to include `show_prerequisite_lines` field in GET/POST/PATCH operations.

## Documentation Map

- **PROJECT_SETUP.md**: Setup and getting started
- **ARCHITECTURE.md**: This file - system design
- **DEPLOYMENT.md**: Deployment guide
- **LOCAL_DEV.md**: Local development
- **PREREQUISITE_LINES.md**: Prerequisite visualization feature details
- **README.md**: User-facing features

---
[ **Back to README** ](README.md) | [ **Quick Reference** ](QUICK_REFERENCE.md) | [ **Project Setup** ](PROJECT_SETUP.md) | [ **Deployment** ](DEPLOYMENT.md)
