# Project Context: Visual Curriculum & Prerequisite Tracker

## User Intention & Objectives
The goal was to create a "visually stunning, modern, and highly interactive" Curriculum Tracker for students. The primary objectives were:
1. **List View**: A clear visualization of subjects grouped by semester, with status indicators (completed, missing, in-progress).
2. **Graph View**: A node-based graph showing subject dependencies (prerequisites).
3. **Interactive Features**: 
    - Hovering over a subject highlights its entire prerequisite chain.
    - Status toggling with automatic "locked" state detection (if prereqs aren't met).
    - Real-time stats calculation (Credits, GPA).
4. **Premium Aesthetics**: Using glassmorphism, vibrant colors (specific-palette), and smooth animations.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: **Tailwind CSS v4** (using the new `@theme` block in CSS and `@tailwindcss/postcss`).
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **State Management**: React Context (`SubjectContext`).

## Implementation Details

### Core Files
- `src/App.tsx`: Main entry, manages view switching (List vs Graph).
- `src/data.ts`: Contains the student data and **Mock Prerequisite Mapping** (inferred for demonstration).
- `src/contexts/SubjectContext.tsx`: Centralized state for subject statuses and logic.
- `src/components/SemesterListView.tsx`: The primary curriculum list view.
- `src/components/CurriculumGraph.tsx`: Custom SVG-based graph visualization with dependency path highlighting logic.
- `src/components/SubjectCard.tsx`: Reusable card with status logic and "Locked" state detection.
- `src/index.css`: Tailwind v4 configuration and global glassmorphism utilities.

### Achievements & Solutions
- **Tailwind v4 Migration**: Successfully configured the build to use `@tailwindcss/postcss` and the new CSS-first theme configuration.
- **Interactive Graph**: Implemented a custom SVG bezier-curve connector system that dynamically highlights ancestor paths based on state.
- **Logic**: Built a system to automatically "Lock" subjects if their prerequisites (defined in `data.ts`) are not marked as "completed".
- **Drag & Drop Reallocation**: Implemented `@dnd-kit` integration to allow moving subjects between semesters in the List View, with persistent storage.
- **JSON Persistence**: Added Import/Export/Reset functionality for the entire curriculum state via JSON files.

## How to Continue
1. **Data Source**: Replace `INITIAL_DATA` in `src/data.ts` with a real API call if needed.
2. **Prerequisites**: Refine the `PREREQUISITES_MAP` in `src/data.ts` with actual academic rules.
3. **Features**:
    - Add a "Plan Semester" mode to select subjects for the "Current" status.
    - Implement a "What-if" scenario where passing a certain subject shows what it unlocks.
    - Add reordering logic *within* semesters using `@dnd-kit/sortable`.


## Current State
- The project is fully functional and builds successfully (`npm run build`).
- The dev server is usually run on port `5173`.
- The user has already `cd`'d into the project directory and verified the file structure.

---
*Created by Antigravity AI - Jan 2026*
