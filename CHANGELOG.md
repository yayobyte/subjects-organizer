# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.0] - 2026-01-19

### Added - Prerequisite Connection Lines Feature

#### Visual Features
- **Prerequisite Connection Lines Visualization**: Animated SVG-based connection lines showing prerequisite relationships
  - Curved bezier paths connecting subjects to their prerequisites
  - Color-coded by prerequisite status:
    - Green solid lines for completed prerequisites
    - Teal solid lines for in-progress prerequisites
    - Red dashed lines for missing/locked prerequisites
  - Arrow markers indicating direction (prerequisite → dependent subject)
  - Smooth fade-in/out animations with stroke-dashoffset drawing effect
  - Auto-updates on scroll and window resize
  - Non-blocking overlay with `pointer-events: none`

#### UI Components
- **ConnectionLinesToggle Component**: Toggle button in navbar
  - GitBranch icon (🌿) from Lucide
  - Positioned between student name and dark mode toggle
  - Active state: crimson-violet color
  - Inactive state: gray color

- **PrerequisiteLines Component**: Main visualization component
  - SVG overlay with absolute positioning
  - Position calculation using `getBoundingClientRect()`
  - Debounced recalculation (100ms) on scroll/resize
  - Memoized connections array for performance
  - Framer Motion animations

#### Backend Changes
- **Database Schema**: Added `show_prerequisite_lines` column to `config` table
- **API Updates**: Updated `/api/config` endpoints (GET/POST/PATCH) to handle new field
- **Migration Script**: Created `api/migration-add-prerequisite-lines.sql`

#### State Management
- **ConfigContext**: Added `showPrerequisiteLines` boolean state
- **configStorage**: Updated Config interface and storage adapter
- Cross-device persistence via Supabase database

#### Performance Optimizations
- Debounced position recalculation on scroll/resize events
- RequestAnimationFrame for smooth rendering
- Memoized calculations with React hooks
- Conditional rendering (only when toggle is ON)
- Efficient DOM queries using `data-subject-id` attributes

#### Documentation
- Created `PREREQUISITE_LINES.md` - comprehensive feature documentation
- Updated `README.md` - added feature description and usage guide
- Updated `ARCHITECTURE.md` - added architecture and implementation details
- Updated `PROJECT_SETUP.md` - added setup instructions and migration steps
- Created `CHANGELOG.md` - this file

#### Files Modified/Created
**New Files:**
- `src/components/ConnectionLinesToggle.tsx`
- `src/components/PrerequisiteLines.tsx`
- `api/migration-add-prerequisite-lines.sql`
- `PREREQUISITE_LINES.md`
- `CHANGELOG.md`

**Modified Files:**
- `src/lib/configStorage.ts`
- `src/contexts/ConfigContext.tsx`
- `api/config.ts`
- `src/components/Layout.tsx`
- `src/components/SubjectCard.tsx`
- `src/components/SemesterListView.tsx`
- `README.md`
- `ARCHITECTURE.md`
- `PROJECT_SETUP.md`

### Technical Details
- SVG path generation using bezier curves
- Position calculation relative to scroll container
- Color mapping based on Subject status
- Smooth animations using Framer Motion
- No external graph visualization libraries required

## [1.0.0] - 2026-01-18

### Initial Release
- Complete curriculum tracker with 99 subjects
- Horizontal semester layout
- Drag & drop between semesters
- Color-coded status system
- Inline editing for all fields
- Dark mode support
- Supabase backend integration
- Vercel serverless deployment
- Real-time statistics
- Cross-device sync
