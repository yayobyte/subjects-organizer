# Project Context: Visual Curriculum & Prerequisite Tracker

**Last Updated**: January 18, 2026

## Overview

A modern curriculum tracking application with Express backend for file-based data persistence. Shows 99 courses across 10 semesters with status tracking, drag & drop, and dark mode support.

## Current Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript 5.9 + Vite 7
- **Backend**: Express.js 5.2 (Node.js)
- **Styling**: Tailwind CSS v4 (using `@theme` directive)
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **State**: React Context API

### Key Features Implemented
1. ✅ **Single List View** - Removed graph view, kept curriculum list only
2. ✅ **Backend API** - Express server with file-based persistence
3. ✅ **Dark Mode** - Toggle with localStorage persistence
4. ✅ **Auto-Save** - Changes save to file automatically (1s debounce)
5. ✅ **University Data Merge** - 99 courses imported from HTML
6. ✅ **Drag & Drop** - Move subjects between semesters
7. ✅ **Status Tracking** - Missing, In Progress, Completed states
8. ✅ **Prerequisite Locking** - Auto-lock based on prerequisites

## Core Files

### Frontend (`src/`)
- **App.tsx** - Main app, removed view switching
- **components/Layout.tsx** - Nav with dark mode toggle (no graph switcher)
- **components/DarkModeToggle.tsx** - Dark mode toggle component
- **components/SemesterListView.tsx** - List view with DnD
- **components/SubjectCard.tsx** - Subject card with status toggle
- **components/StatsDashboard.tsx** - Real-time statistics
- **components/DroppableSemester.tsx** - DnD semester container
- **contexts/SubjectContext.tsx** - Global state + API integration
- **lib/storage.ts** - Storage abstraction (API/localStorage/file/hybrid)
- **data.ts** - Prerequisites map

### Backend (`server/`)
- **index.js** - Express server with CRUD endpoints
- **data/curriculum.json** - Live curriculum data (99 courses)
- **data/curriculum.backup.json** - Reset backup

### Removed/Archived (`.backup/`)
- **CurriculumGraph.tsx** - Graph view (removed per user request)
- **JSONActions.tsx** - Import/export buttons (replaced with dark mode)

## Architecture Details

### 1. Backend API Persistence

**Problem Solved**: User didn't want localStorage or automatic downloads. Needed file-based persistence.

**Solution**: Express backend that reads/writes to `server/data/curriculum.json`

**Endpoints**:
- `GET /api/curriculum` - Load data
- `POST /api/curriculum` - Save data
- `POST /api/curriculum/reset` - Reset from backup
- `GET /api/health` - Health check

**How it works**:
1. Frontend uses `APIStorageAdapter` in `src/lib/storage.ts`
2. Changes debounced by 1 second before saving
3. Vite proxies `/api` to `localhost:3001` during dev
4. Data persists across page refreshes

### 2. Storage Abstraction Layer

Located in `src/lib/storage.ts`:

**Available Adapters**:
- `APIStorageAdapter` - Backend API (default)
- `LocalStorageAdapter` - Browser storage
- `JSONFileAdapter` - Download-based (legacy)
- `HybridStorageAdapter` - localStorage + manual export

**Configuration**: Set `VITE_STORAGE_TYPE` environment variable

**Factory Pattern**: `getStorageAdapter()` returns configured adapter

### 3. Dark Mode Implementation

**Component**: `src/components/DarkModeToggle.tsx`

**How it works**:
1. Initializes theme before React renders (module-level execution)
2. Checks localStorage first, then system preference
3. Applies `dark` class to `document.documentElement`
4. Persists choice to localStorage
5. Moon/Sun icon with smooth transitions

**Key Fix**: Theme applied immediately on load to prevent flash

### 4. University Data Merge

**Date**: January 18, 2026

**Process**:
1. Placed HTML export in `server/data/universityData.html`
2. Agent parsed HTML and extracted 95 courses
3. Ran `scripts/mergeUniversityData.js` to merge with existing 58 courses
4. Result: 99 total courses (14 status changes, 41 new courses)

**Details in**: `MERGE_SUMMARY.md`

**Key Changes**:
- 3 courses changed to completed (IS142, IS453, IS773)
- 10 courses changed to in-progress
- 1 course changed from completed to in-progress (IS184 - needs verification)
- Many humanities electives added to Semestre 7

### 5. View Simplification

**Removed**: Graph view completely
- Deleted `CurriculumGraph.tsx`
- Removed view switching UI
- Simplified `App.tsx` and `Layout.tsx`
- Single list view only

**Replaced**: Export/Import buttons with dark mode toggle
- Removed `JSONActions.tsx`
- Added `DarkModeToggle.tsx`
- Cleaner navigation bar

## Development Workflow

### Running the App

```bash
npm run dev      # Both frontend + backend
npm run client   # Frontend only
npm run server   # Backend only
```

**URLs**:
- Frontend: http://localhost:5173 (or next available)
- Backend: http://localhost:3001

### Data Flow

1. User loads app → `SubjectContext` calls `storage.load()`
2. `APIStorageAdapter` fetches from `/api/curriculum`
3. Backend reads `server/data/curriculum.json`
4. Data renders in UI
5. User changes status/drags subject
6. State updates in React
7. After 1s debounce → `storage.save()` called
8. API POST to `/api/curriculum`
9. Backend writes to `curriculum.json`

### Making Changes

**Update curriculum data**:
1. Edit `server/data/curriculum.json` directly, OR
2. Use the UI (auto-saves), OR
3. Run merge script for university updates

**Add/modify components**:
- Changes hot-reload via Vite
- Backend needs manual restart if server code changes

## Current Data Status

- **Total Courses**: 99
- **Completed**: 27 courses
- **In Progress**: 45 courses
- **Missing**: 27 courses
- **Student**: Cristian Gutierrez Gonzalez
- **Source**: University HTML merged January 18, 2026

## Known Issues

1. **TypeScript warnings** in `tsconfig.node.json` (doesn't affect functionality)
2. **Truncated course names** from HTML source (ending with "...")
3. **Null credits** on new courses (university HTML didn't include)
4. **IS184 status** changed from completed→in-progress (needs user verification)

## Configuration Options

### Storage Adapter

Change via `.env`:
```bash
VITE_STORAGE_TYPE=api          # Default
VITE_STORAGE_TYPE=localStorage
VITE_STORAGE_TYPE=hybrid
VITE_STORAGE_TYPE=file
```

### Prerequisites

Edit `src/data.ts`:
```typescript
export const PREREQUISITES_MAP: Record<string, string[]> = {
    "IS284": ["IS105"],  // Prog II requires Prog I
    // ...
};
```

### Colors

Edit `src/index.css` `@theme` block

### Dark Mode Default

Toggle applies immediately and persists. No config needed.

## Scripts & Utilities

### University Data Merge

```bash
# Place new HTML in server/data/universityData.html
node scripts/mergeUniversityData.js

# Review output in:
# - server/data/curriculum.merged.json
# - Console report with changes

# If satisfied, copy:
cp server/data/curriculum.merged.json server/data/curriculum.json
cp server/data/curriculum.merged.json server/data/curriculum.backup.json
```

## Production Deployment

### Building

```bash
npm run build  # Creates dist/ folder
```

### Deployment Steps

1. **Frontend**: Serve `dist/` folder with static server
2. **Backend**: Run `node server/index.js` separately
3. **Environment**: Set `VITE_API_URL` to backend URL if different domain
4. **CORS**: Update CORS settings in `server/index.js` for production

### Example (PM2)

```bash
# Backend
pm2 start server/index.js --name curriculum-api

# Frontend (using serve)
pm2 serve dist 5173 --name curriculum-frontend --spa
```

## Future Enhancements

### Completed ✅
- Backend API integration
- Dark mode toggle
- University data import
- File-based persistence

### Pending 📋
- "What-if" scenario planning
- Within-semester reordering
- PDF export
- Multiple student profiles
- User authentication
- Cloud storage sync
- Mobile app version

## Technical Decisions Log

### Why Express Backend?
- User wanted file-based persistence without downloads
- Browser can't write to local files (security)
- Express simple, lightweight, perfect for JSON CRUD
- Easy to add authentication later

### Why Remove Graph View?
- User preference
- Simpler codebase
- Focus on core functionality
- Can restore from `.backup/` if needed

### Why Storage Abstraction?
- Flexibility to switch between persistence methods
- Easy testing with different adapters
- Clean separation of concerns
- Future-proof for cloud storage

### Why Dark Mode Over Export Buttons?
- User request
- Better UX (common feature)
- Data auto-saves anyway (no manual export needed)
- Export buttons moved to backup if needed later

## Troubleshooting

### Dark Mode Not Working
- Check `DarkModeToggle.tsx` loads before render
- Verify Tailwind config has `darkMode: ["class"]`
- Clear localStorage and test again

### Data Not Persisting
- Check backend is running on port 3001
- Verify Vite proxy in `vite.config.ts`
- Check browser console for API errors
- Ensure `server/data/` directory is writable

### Drag & Drop Issues
- Verify @dnd-kit packages installed
- Check `DndContext` wraps components properly
- Ensure subject has unique `id`

### Backend Won't Start
- Check port 3001 not in use: `lsof -ti:3001`
- Verify `server/data/curriculum.json` exists
- Check Node.js version (18+)

---

**For user-facing documentation, see**: `README.md`
**For merge details, see**: `MERGE_SUMMARY.md`
