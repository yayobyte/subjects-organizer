# Project Context: Visual Curriculum & Prerequisite Tracker

## User Intention & Objectives
The goal was to create a "visually stunning, modern, and highly interactive" Curriculum Tracker for students. The primary objectives were:
1. **List View**: A clear visualization of subjects grouped by semester, with status indicators (completed, missing, in-progress).
2. **Graph View**: A node-based graph showing subject dependencies (prerequisites).
3. **Interactive Features**: 
    - Hovering over a subject highlights its entire prerequisite chain.
    - Status toggling with automatic "locked" state detection (if prereqs aren't met).
    - Real-time stats calculation (Credits, GPA).
    - Drag and drop subjects between semesters.
    - Import/Export curriculum data as JSON files.
4. **Premium Aesthetics**: Using glassmorphism, vibrant colors (specific-palette), and smooth animations.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Language**: TypeScript 5.9
- **Styling**: **Tailwind CSS v4** (using the new `@theme` block in CSS and `@tailwindcss/postcss`).
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities
- **State Management**: React Context (`SubjectContext`).

## Implementation Details

### Core Files
- `src/App.tsx`: Main entry, manages view switching (List vs Graph).
- `src/data.ts`: Contains the student data and **Mock Prerequisite Mapping** (inferred for demonstration).
- `src/contexts/SubjectContext.tsx`: Centralized state for subject statuses, drag & drop logic, and data persistence.
- `src/components/SemesterListView.tsx`: The primary curriculum list view with DnD context.
- `src/components/CurriculumGraph.tsx`: Custom SVG-based graph visualization with dependency path highlighting logic.
- `src/components/SubjectCard.tsx`: Reusable card with status logic, "Locked" state detection, and draggable functionality.
- `src/components/DroppableSemester.tsx`: Droppable container for semester sections.
- `src/components/JSONActions.tsx`: Import/Export/Reset buttons for data management.
- `src/components/Layout.tsx`: Main app shell with navigation and view switcher.
- `src/components/StatsDashboard.tsx`: Real-time statistics display.
- `src/index.css`: Tailwind v4 configuration and global glassmorphism utilities.

### Achievements & Solutions
- **Tailwind v4 Migration**: Successfully configured the build to use `@tailwindcss/postcss` and the new CSS-first theme configuration with `@theme` directive.
- **Interactive Graph**: Implemented a custom SVG bezier-curve connector system that dynamically highlights ancestor paths based on state.
- **Prerequisite Logic**: Built a system to automatically "Lock" subjects if their prerequisites (defined in `data.ts`) are not marked as "completed".
- **Drag & Drop Reallocation**: Implemented `@dnd-kit` integration to allow moving subjects between semesters in the List View, with persistent storage.
- **JSON Persistence**: Added Import/Export/Reset functionality for the entire curriculum state via JSON files.
- **LocalStorage Fix**: Resolved race condition bug by initializing state from localStorage in the `useState` initializer function instead of useEffect.
- **Animation Optimization**: Removed layout animations from cards for instant, real-time drag feedback.
- **UX Improvements**: Repositioned drag handle to the right side of cards, away from status toggle button.

## Key Technical Decisions

### 1. State Management
Used React Context API instead of external libraries (Redux, Zustand) for simplicity and to avoid over-engineering. The `SubjectContext` provides:
- `subjects`: Array of all subjects
- `toggleSubjectStatus`: Cycle through status states
- `updateSubjectStatus`: Set specific status
- `moveSubjectToSemester`: Handle drag & drop operations
- `exportData`: Download JSON file
- `importData`: Upload JSON file
- `resetData`: Restore defaults

### 2. Drag & Drop Implementation
- **Library**: @dnd-kit chosen for its flexibility and TypeScript support
- **Architecture**: 
  - `SubjectCard` components are draggable (using `useDraggable`)
  - `DroppableSemester` components are drop zones (using `useDroppable`)
  - `DndContext` wraps the entire list view
  - `handleDragEnd` validates the move before calling `moveSubjectToSemester`
- **UX**: Removed Framer Motion's `layout` prop to prevent animation delays during drag operations

### 3. Data Persistence
- **Primary**: LocalStorage for automatic browser-based persistence
- **Secondary**: JSON Import/Export for cross-browser/device sharing
- **Bug Fix**: Initialize state from localStorage in `useState(() => {...})` to prevent race condition where default data overwrites saved data

### 4. Styling Approach
- **Tailwind v4**: Uses new `@theme` block in CSS for theme configuration
- **Inline Styles**: Replaced utility classes like `glass-panel` with inline Tailwind classes for v4 compatibility
- **Custom Colors**: Defined in `@theme` block using CSS custom properties
- **Glassmorphism**: Achieved with `backdrop-blur-md` and semi-transparent backgrounds

## How to Continue

### Adding New Features
1. **Data Source**: Replace `INITIAL_DATA` in `src/data.ts` with a real API call if needed.
2. **Prerequisites**: Refine the `PREREQUISITES_MAP` in `src/data.ts` with actual academic rules.
3. **Suggested Features**:
    - Add a "Plan Semester" mode to select subjects for the "Current" status.
    - Implement a "What-if" scenario where passing a certain subject shows what it unlocks.
    - Add reordering logic *within* semesters using `@dnd-kit/sortable`.
    - Add backend API for multi-device synchronization.
    - Implement user authentication and multiple student profiles.
    - Add PDF export functionality.
    - Create a dark mode toggle (currently uses system preference).

### Modifying Data
1. **Student Info**: Edit `INITIAL_DATA.studentName` in `src/data.ts`
2. **Subjects**: Add/remove/modify subjects in `INITIAL_DATA.subjects` array
3. **Prerequisites**: Update `PREREQUISITES_MAP` object in `src/data.ts`
4. **Semesters**: The `SEMESTERS` array is auto-generated from subject data

### Customizing Appearance
1. **Colors**: Edit the `@theme` block in `src/index.css`
2. **Fonts**: Change `--font-sans` in `@theme` block or update Google Fonts link in `index.html`
3. **Layout**: Modify `src/components/Layout.tsx` for navigation changes
4. **Card Design**: Edit `src/components/SubjectCard.tsx` for subject card appearance

## Current State
- The project is fully functional and builds successfully (`npm run build`).
- The dev server runs on port `5173` by default.
- All files have been moved to the root `/Users/user/Workspace/assignments` directory.
- LocalStorage persistence is working correctly after bug fix.
- Drag & Drop is functional with instant feedback.

## Known Issues
- TypeScript configuration warnings in `tsconfig.node.json` (does not affect functionality):
  - `tsBuildInfoFile` option requires `incremental` or `composite`
  - `target` option has invalid value
  - Unknown compiler options: `erasableSyntaxOnly`, `noUncheckedSideEffectImports`
- These are Vite-generated config issues and can be safely ignored.

## Development Workflow

### Running the Project
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing Changes
1. Make code changes
2. Vite will hot-reload automatically
3. Test in browser at http://localhost:5173
4. Verify persistence by refreshing the page
5. Test drag & drop functionality
6. Export data to verify JSON structure

### Deployment
1. Run `npm run build`
2. Deploy the `dist/` folder to any static hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Any web server

## Architecture Patterns

### Component Hierarchy
```
App (SubjectProvider wrapper)
└── CurriculumTracker
    └── Layout
        ├── Header (with JSONActions and view switcher)
        └── Main Content
            ├── SemesterListView (when view === 'list')
            │   └── DndContext
            │       └── Semesters (mapped)
            │           └── DroppableSemester
            │               └── SubjectCards (mapped)
            └── CurriculumGraph (when view === 'graph')
                └── SVG with nodes and connections
```

### Data Flow
1. User interacts with UI (click, drag, import)
2. Component calls context function (e.g., `toggleSubjectStatus`)
3. Context updates state via `setData`
4. State change triggers useEffect
5. useEffect saves to localStorage
6. React re-renders affected components
7. UI updates to reflect new state

## File Manifest

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - Base TypeScript config
- `tsconfig.app.json` - App-specific TS config
- `tsconfig.node.json` - Node/Vite TS config
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS plugins
- `eslint.config.js` - ESLint rules
- `.gitignore` - Git ignore patterns

### Documentation
- `README.md` - User-facing documentation
- `PROJECT_CONTEXT.md` - This file (developer documentation)

### Source Code
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app component
- `src/index.css` - Global styles and Tailwind
- `src/types.ts` - TypeScript type definitions
- `src/data.ts` - Student data and prerequisites
- `src/lib/utils.ts` - Utility functions
- `src/contexts/SubjectContext.tsx` - Global state
- `src/components/*.tsx` - React components

---
*Last Updated: January 18, 2026*
*Created by Antigravity AI*
