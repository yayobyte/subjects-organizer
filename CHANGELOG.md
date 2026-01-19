# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.2.0] - 2026-01-19

### Removed - Cross-Semester Drag and Drop
- **Removed cross-semester drag functionality**: Subjects can no longer be dragged between semesters
- **Simplified drag and drop**: Now only supports within-semester reordering
- **User workflow change**: To move subjects to different semesters, users must delete and recreate them
- **Removed DroppableSemester component**: Eliminated unnecessary wrapper component
- **Simplified handleDragEnd logic**: Cleaner implementation focused solely on within-semester reordering

#### Technical Changes
- Deleted `src/components/DroppableSemester.tsx`
- Removed `moveSubjectToSemester` function from SubjectContext
- Updated `handleDragEnd` to only handle within-semester drops
- Updated UI text and tooltips to reflect within-semester-only functionality
- Updated all documentation (README, ARCHITECTURE, PROJECT_SETUP)

#### Rationale
- Cross-semester drag was not working correctly
- Simplified user experience and codebase
- Reduced complexity in drag and drop logic
- Users can still reorganize by deleting and recreating subjects

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
- Drag & drop within semesters for reordering
- Color-coded status system
- Inline editing for all fields
- Dark mode support
- Supabase backend integration
- Vercel serverless deployment
- Real-time statistics
- Cross-device sync
