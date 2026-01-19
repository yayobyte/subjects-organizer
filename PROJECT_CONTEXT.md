# Project Context: Visual Curriculum & Prerequisite Tracker

**Last Updated**: January 19, 2026 (Evening) - Credits UI improved, storage simplified, all semesters visible, 3-row layout

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
1. ✅ **Horizontal Semester Layout** - Row-based layout for landscape mode viewing (all 10 semesters always visible)
2. ✅ **Backend API** - Express server with file-based persistence (API-only, simplified)
3. ✅ **Dark Mode** - Toggle with localStorage persistence
4. ✅ **Auto-Save** - Changes save to file automatically (1s debounce)
5. ✅ **University Data Merge** - 99 courses imported from HTML
6. ✅ **Drag & Drop** - Move subjects between semesters with visible grip handles
7. ✅ **One-Click Status Toggle** - Single click to change status (fixed double-click issue)
8. ✅ **Add New Subjects** - Inline form to add subjects to any semester (auto-credit detection)
9. ✅ **Inline Grade Editing** - Click to edit grades on all subjects
10. ✅ **Inline Credits Editing** - Popover UI with quick-select buttons (0-6) + custom input (7-12)
11. ✅ **Inline Name Editing** - Click any subject name to edit inline
12. ✅ **Delete Subjects** - Custom animated confirmation modal
13. ✅ **Prerequisite Locking** - Auto-lock based on prerequisites
14. ✅ **Fixed Card Dimensions** - Consistent w-full × h-32 with clean 3-row layout

## Core Files

### Frontend (`src/`)
- **App.tsx** - Main app, removed view switching
- **components/Layout.tsx** - Full-width nav with dark mode toggle
- **components/DarkModeToggle.tsx** - Dark mode toggle component
- **components/SemesterListView.tsx** - Horizontal row-based list view with DnD
- **components/SubjectCard.tsx** - Card with full inline editing (name, grade, credits, status) + delete
- **components/AddSubjectButton.tsx** - Simplified form with auto-credit detection
- **components/ConfirmDialog.tsx** - Custom animated confirmation modal for deletions
- **components/StatsDashboard.tsx** - Real-time statistics
- **components/DroppableSemester.tsx** - DnD semester container
- **contexts/SubjectContext.tsx** - Global state + API integration + all edit/delete methods
- **lib/storage.ts** - API storage adapter (backend persistence only)
- **data.ts** - Prerequisites map + getSortedSemesters() (returns all 10 semesters)

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

### 2. Dark Mode Implementation

**Component**: `src/components/DarkModeToggle.tsx`

**How it works**:
1. Initializes theme before React renders (module-level execution)
2. Checks localStorage first, then system preference
3. Applies `dark` class to `document.documentElement`
4. Persists choice to localStorage
5. Moon/Sun icon with smooth transitions

**Key Fix**: Theme applied immediately on load to prevent flash

### 3. Horizontal Layout & UI Improvements (January 18, 2026 - Evening)

**Problem**: User wanted better landscape viewing and easier data editing

**Changes Made**:

1. **Horizontal Semester Layout**:
   - Changed from vertical stacking to horizontal row layout
   - Removed `max-w-7xl` constraints for full-width viewing
   - Each semester is a 320px column scrolling horizontally
   - Subjects stack vertically within each semester

2. **Single-Click Status Toggle**:
   - Fixed double-click issue by moving drag listeners to grip button only
   - Added `e.stopPropagation()` on checkbox to prevent drag interference
   - Now works with single click as expected

3. **Visible Drag Handles**:
   - Changed grip icon from `opacity-0` to `opacity-50` (always visible)
   - Increased size from 16px to 20px
   - Added hover background for better affordance
   - Users can clearly see where to drag

4. **Fixed Card Dimensions**:
   - All cards now `w-full h-32` for consistent appearance
   - Added `flex flex-col` for proper content organization

5. **Add Subject Feature**:
   - New `AddSubjectButton` component at bottom of each semester
   - Expands into inline form with animated transition
   - Fields: Course Code, Subject Name, Credits
   - Fixed form input issue (credits field now uses empty string default)
   - Auto-adds to correct semester

6. **Inline Grade Editing**:
   - Click grade badge on completed subjects to edit
   - Supports numeric (95) or text ("Aprobada") grades
   - Shows "Add grade" if no grade exists
   - Keyboard shortcuts: Enter to save, Escape to cancel
   - Edit icon appears on hover

7. **Inline Credits Editing**:
   - Click credits badge on any subject to edit
   - Validates 1-12 credits range
   - Same keyboard shortcuts as grade editing
   - Edit icon appears on hover

**Context Methods Added**:
- `addSubject(subject: Subject)` - Adds new subject to curriculum
- `updateSubjectGrade(id: string, grade: number | string)` - Updates grade
- `updateSubjectCredits(id: string, credits: number)` - Updates credits

### 4. Extended Editing & Delete Features (January 19, 2026 - Late Evening)

**Problem**: User wanted comprehensive editing capabilities and delete functionality

**Database Fix**:
- Converted all null credits to 0 in both curriculum.json and backup (34 subjects in main, 41 in backup)
- Ensures consistent data structure for all calculations

**Changes Made**:

1. **Subject Name Editing**:
   - Click any subject name to edit inline
   - Small edit icon appears on hover
   - Input field with border when editing
   - Keyboard shortcuts (Enter/Escape)
   - Auto-saves on blur
   - Added `updateSubjectName` method to context

2. **Grade Editing for All Subjects**:
   - Previously only available for completed subjects
   - Now available for ALL subjects regardless of status
   - Dynamic styling:
     - Completed: Green/emerald theme
     - Not completed: Gray/slate theme
   - Shows "Add grade" badge on all subjects

3. **Simplified Add Subject Form**:
   - Removed credits field from form
   - Only requires: Course Code + Subject Name
   - Auto-extracts credits from last digit of ID:
     - IS105 → 5 credits
     - CS201 → 1 credit
     - MATH3 → 3 credits
     - Non-digit last char → 0 credits
   - Updated placeholder: "e.g., IS105 (last digit = credits)"

4. **Delete Subject Feature**:
   - Added `deleteSubject` method to context
   - Beautiful custom confirmation modal (ConfirmDialog component):
     - Animated backdrop with blur
     - Red warning icon with AlertTriangle
     - Clear title and message
     - Shows subject name and ID
     - "This action cannot be undone" warning
     - Red delete button + gray cancel button
     - X button to close
     - Smooth animations via Framer Motion
   - Replaces browser's default alert

5. **Action Buttons Repositioned**:
   - Moved from top-right overlay to bottom row
   - Bottom row now uses `justify-between`:
     - Left: Credits, Grade, Locked indicator
     - Right: Delete + Drag buttons
   - Delete button:
     - Hidden by default (opacity-0)
     - Appears on card hover
     - Red on hover
     - Trash icon (14px)
   - Drag button:
     - Semi-transparent by default (opacity-50)
     - Fully visible on hover
     - Violet on hover
     - Grip icon (16px)

**Context Methods Added**:
- `updateSubjectName(id: string, name: string)` - Updates subject name
- `deleteSubject(id: string)` - Removes subject from curriculum

**New Components**:
- `ConfirmDialog.tsx` - Reusable confirmation modal with animations

### 5. Credits Editing Improvement & Storage Cleanup (January 19, 2026 - Evening)

**Problem**: Credits input was a basic number field, and multiple storage adapters caused confusion

**Changes Made**:

1. **Popover-Style Credits Selector**:
   - Replaced number input with elegant popover UI
   - Quick-select buttons for 0-6 credits (one click)
   - "More (7-12)" option for edge cases
   - Appears above the badge, doesn't overflow card
   - Click outside to close functionality
   - Clean shadow and animations

2. **Storage System Simplification**:
   - Removed `LocalStorageAdapter`, `JSONFileAdapter`, `HybridStorageAdapter`
   - Kept only `APIStorageAdapter` for backend persistence
   - Deleted `STORAGE.md` and `STORAGE_IMPLEMENTATION.md`
   - Simplified `getStorageAdapter()` to always return API adapter
   - Updated all documentation to reflect API-only approach

3. **Always Show All Semesters**:
   - Modified `getSortedSemesters()` to always return 10 semesters
   - Empty semesters now display with "Drop subjects here" placeholder
   - Can add subjects to any semester, even empty ones
   - Maintains consistent horizontal scroll layout

4. **Card Layout Refinement**:
   - Restructured to proper 3-row layout:
     - Row 1: Subject name + ID
     - Row 2: Credits + Grade badges (left-aligned)
     - Row 3: Locked badge (left) + Action buttons (right)
   - Fixed overflow issues with locked badge
   - Clean spacing with `justify-between` on row 3
   - Maintains fixed h-32 card height

**Technical Details**:
- Credits popover uses `useRef` + `useEffect` for click-outside detection
- Storage adapter reduced from 200 lines to 77 lines
- Semester list always renders 10 columns for consistency

### 6. University Data Merge

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

### 7. View Simplification

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
- Horizontal semester layout
- Single-click status toggle
- Add new subjects with auto-credit detection
- Inline grade editing (all subjects)
- Inline credits editing with popover UI
- Inline subject name editing
- Delete subjects with custom confirmation modal
- Visible drag handles
- Fixed card dimensions (w-full × h-32)
- 3-row card layout (name, badges, actions)
- Null credits database fix
- Storage system simplified to API-only
- All 10 semesters always visible

### Pending 📋
- Edit course IDs
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

### Why Dark Mode Over Export Buttons?
- User request
- Better UX (common feature)
- Data auto-saves anyway (no manual export needed)
- Export buttons moved to backup if needed later

### Why Horizontal Layout?
- User requested landscape mode optimization
- Better overview of all semesters at once
- Matches typical timeline/roadmap UI patterns
- Maximizes screen real estate
- Easier to compare subjects across semesters

### Why Inline Editing?
- Faster than modal dialogs
- No context switching
- Direct manipulation feels more natural
- Keyboard shortcuts for power users
- Consistent with modern UI patterns (Notion, Linear, etc.)

### Why Drag Handle Instead of Card Drag?
- Fixed double-click checkbox issue
- Clear affordance for draggability
- Prevents accidental drags when clicking
- Common pattern in sortable lists
- Makes drag-and-drop more intentional

### Why Auto-Extract Credits from ID?
- Simplifies add subject form (2 fields instead of 3)
- Follows convention where last digit = credits (IS105, CS201, etc.)
- Reduces user input errors
- Faster subject creation workflow
- Can still be edited after creation

### Why Custom Confirmation Modal?
- Native browser alerts feel outdated
- Better UX with animations and styling
- Consistent with app's design language
- Shows more context (subject name + ID)
- Professional appearance
- Clear warning message with icon

### Why Allow Grade Editing on All Subjects?
- User flexibility - can add grades before marking complete
- Useful for tracking partial grades or predictions
- No technical limitation preventing it
- Dynamic styling differentiates completed vs incomplete
- More powerful than restricting to completed only

### Why Action Buttons in Bottom Row?
- Better use of space in fixed-height cards
- Groups related actions together
- Left side: data (credits, grade, status)
- Right side: actions (delete, drag)
- Clear visual separation with justify-between

### Why Popover Credits Selector?
- Original inline buttons overflowed card width
- Popover appears above badge, doesn't affect layout
- Quick-select buttons (0-6) cover 99% of use cases
- Professional appearance with shadow and border
- Click-outside-to-close matches modern UI patterns
- No overflow or layout breaking

### Why Simplify to API-Only Storage?
- Single source of truth reduces confusion
- Multiple adapters were unnecessary complexity
- Backend API is the production solution
- Easier to understand and maintain
- Fewer files to manage (removed 2 MD files)
- Clear data flow: UI → API → File

### Why Always Show All 10 Semesters?
- Empty semesters need to be accessible for adding subjects
- Consistent UI regardless of data state
- Users can plan ahead by adding to future semesters
- Horizontal scroll shows complete curriculum timeline
- Prevents UI layout shifts when semesters become empty

### Why 3-Row Card Layout?
- Prevents overflow issues with locked badge
- Clear visual hierarchy: name → metadata → actions
- Locked badge and action buttons don't interfere
- Each row has specific purpose and alignment
- Maintains fixed card height (h-32) consistently

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

### Checkbox Requires Double-Click
- Ensure drag listeners are only on grip button, not entire card
- Check `e.stopPropagation()` is called in checkbox onClick
- Verify grip button has `{...listeners}` and `{...attributes}`

### Inline Editing Not Working
- Check that edit state is managed in component (useState)
- Verify keyboard event handlers (Enter/Escape)
- Ensure onBlur saves changes
- Check that context methods exist (updateSubjectGrade, updateSubjectCredits)

### Add Subject Form Issues
- Verify auto-credit extraction regex works: `/^\d$/`
- Check form only requires ID and name (not credits)
- Ensure AddSubjectButton receives semester prop
- Check that addSubject method exists in context
- Verify last digit extraction: `formData.id.trim().slice(-1)`

### Delete Not Working
- Check ConfirmDialog component is imported
- Verify showDeleteDialog state is managed
- Ensure deleteSubject method exists in context
- Check modal animations (AnimatePresence)
- Verify confirmation triggers handleDelete

### Name Editing Issues
- Check updateSubjectName method exists in context
- Verify edit icon appears on hover (Edit2 from lucide-react)
- Ensure keyboard handlers (Enter/Escape) work
- Check that name input autofocuses
- Verify stopPropagation prevents card drag

### Null Credits Errors
- All null credits should be converted to 0
- Run database fix script if needed:
  ```js
  // Fix null credits
  data.subjects = data.subjects.map(s => ({...s, credits: s.credits || 0}))
  ```
- Check all credit calculations handle 0 correctly

### Credits Popover Not Closing
- Check `creditsPopoverRef` is properly attached to popover div
- Verify `useEffect` click-outside listener is set up
- Ensure `isEditingCredits` state updates correctly
- Try clicking the badge again to toggle close

### Empty Semester Not Showing
- Check `getSortedSemesters()` returns all 10 semesters
- Verify array is hardcoded: `['Semestre 1', ..., 'Semestre 10']`
- Confirm `SemesterListView` maps over all returned semesters
- Empty semesters should show "Drop subjects here" placeholder

### Card Layout Overflowing
- Verify 3-row structure in SubjectCard:
  - Row 1: flex justify-between (name + ID)
  - Row 2: flex gap-2 (credits + grade)
  - Row 3: flex justify-between (locked + actions)
- Check card has fixed h-32 height
- Ensure no extra nested flex containers causing issues

---

**For user-facing documentation, see**: `README.md`
**For merge details, see**: `MERGE_SUMMARY.md`
