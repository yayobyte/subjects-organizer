# Visual Curriculum & Prerequisite Tracker

A modern, interactive web application for tracking academic progress with seamless data persistence and cross-device sync. Built with React, TypeScript, Tailwind CSS v4, and Supabase.

**Last Updated**: January 19, 2026 - Migrated to Supabase + Vercel serverless functions

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)

## ✨ Features

### 📚 Curriculum View
- **Horizontal Semester Layout**: Semesters displayed from left to right in landscape mode for better overview
- **Full-Width Display**: No horizontal limits - uses entire screen width for maximum visibility
- **Drag & Drop Reordering**: Move subjects between semesters with visible drag handles
- **Visual Feedback**: Clear grip icons and drag indicators
- **Instant Updates**: Real-time movement without animation delays
- **Fixed Card Dimensions**: Consistent card sizes (w-full × h-32) for uniform appearance

### 🎯 Smart Subject Management
- **Color-Coded Status System**: Visual status indicators with distinct background colors
  - 🟢 **Green**: Completed courses (approved)
  - 🔵 **Blue**: In-progress courses (currently taking)
  - 🟡 **Amber/Orange**: Ready courses (prerequisites met, available to take)
  - 🔴 **Red**: Locked courses (prerequisites not met)
- **Visual Prerequisite Connections**: Toggle animated connection lines showing prerequisite relationships
  - Curved bezier paths connecting subjects to their prerequisites
  - Color-coded by status (green/teal/red) with dashed lines for missing prerequisites
  - Auto-updates on scroll with smooth animations
  - Toggleable via navbar button with persistent state
- **One-Click Status Toggle**: Single click to cycle subjects between Missing, In Progress, and Completed states
- **Add New Subjects**: Simplified inline form with auto-credit detection from course ID
- **Edit Subject Names**: Click any subject name to edit inline
- **Edit Credits**: Click any subject's credit badge with popover selector (0-6 quick buttons, 7-12 custom)
- **Edit Grades**: Click grade badge on ANY subject to add or modify grades (supports numeric or text)
- **Edit Prerequisites**: Searchable dropdown to add/remove prerequisites inline
- **Delete Subjects**: Beautiful confirmation modal with smooth animations
- **Inline Editing**: Keyboard shortcuts (Enter to save, Escape to cancel) for quick updates
- **Prerequisite Locking**: Subjects automatically lock if prerequisites aren't met
- **Real-time Statistics**: Live calculation of progress, GPA, credits, and remaining subjects
- **99 Total Courses**: Complete curriculum imported from university data

### 🎨 Premium Design
- **Cross-Device Dark Mode**: Backend-synced dark mode that works across all devices
- **Editable Student Name**: Click your name in navbar to edit with backend sync
- **Glassmorphism UI**: Modern, translucent design with backdrop blur effects
- **Custom Color Palette**: Carefully curated colors (Crimson Violet, Deep Crimson, Princeton Orange, Autumn Leaf, Dark Teal)
- **Smooth Animations**: Powered by Framer Motion for cinematic transitions
- **Responsive Layout**: Fully optimized for desktop and mobile devices

### 🔄 Data Persistence
- **Supabase Backend**: PostgreSQL database hosted on Supabase
- **Vercel Serverless Functions**: API routes deployed as serverless functions
- **Configuration Sync**: User preferences (dark mode, student name, prerequisite lines toggle) sync across devices
- **Real-time Updates**: Changes automatically saved to database
- **Cross-Device Sync**: Access your data from any device

### 🖱️ Drag & Drop
- **Semester Reallocation**: Drag subjects between semesters to reorganize your plan
- **Visual Feedback**: Clear indicators when dragging and dropping
- **Instant Updates**: Real-time movement without animation delays

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

### Development Commands

```bash
npm run dev      # Run development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions to Vercel with Supabase.

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS v4 (with @tailwindcss/postcss)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **State Management**: React Context API

### Backend
- **Database**: Supabase (PostgreSQL)
- **API**: Vercel Serverless Functions
- **Client**: @supabase/supabase-js
- **API Endpoints**: RESTful API for curriculum and config operations

## 📁 Project Structure

```
assignments/
├── src/
│   ├── components/           # React components
│   │   ├── Layout.tsx       # Main app shell with navigation (full-width)
│   │   ├── DarkModeToggle.tsx  # Dark mode toggle component
│   │   ├── ConnectionLinesToggle.tsx  # Prerequisite lines toggle
│   │   ├── PrerequisiteLines.tsx      # SVG connection lines visualization
│   │   ├── SemesterListView.tsx  # Horizontal list view with DnD
│   │   ├── SubjectCard.tsx       # Subject card with full inline editing + delete
│   │   ├── AddSubjectButton.tsx  # Add subject form (auto-credit detection)
│   │   ├── ConfirmDialog.tsx     # Custom confirmation modal for deletions
│   │   ├── StatsDashboard.tsx    # Progress statistics
│   │   ├── PrerequisiteEditor.tsx     # Prerequisite inline editor
│   │   └── DroppableSemester.tsx # DnD semester container
│   ├── contexts/
│   │   ├── SubjectContext.tsx    # Curriculum state management
│   │   └── ConfigContext.tsx     # User preferences state
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   ├── storage.ts       # Curriculum API storage adapter
│   │   └── configStorage.ts # Config API storage adapter
│   ├── data.ts              # Prerequisites map
│   ├── types.ts             # TypeScript interfaces
│   ├── index.css            # Global styles & Tailwind config
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── server/
│   ├── index.js             # Express server
│   └── data/
│       ├── curriculum.json        # Live curriculum data
│       └── curriculum.backup.json # Backup for reset
├── scripts/
│   └── mergeUniversityData.js  # Utility to merge university data
├── .backup/                 # Archived components
├── public/                  # Static assets
├── PROJECT_CONTEXT.md       # Detailed project documentation
├── MERGE_SUMMARY.md         # University data merge report
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration (with API proxy)
```

## 🎮 Usage Guide

### Understanding the Color System
Each subject card is color-coded based on its current status to help you quickly identify what you need to focus on:

- **🟢 Green (Completed)**: Courses you've already finished and approved
- **🔵 Blue (In Progress)**: Courses you're currently taking this semester
- **🟡 Amber/Orange (Ready)**: Courses available to take - all prerequisites are met!
- **🔴 Red (Locked)**: Courses you can't take yet - prerequisites haven't been completed

The color system works in both light and dark modes with automatically adjusted contrast for optimal readability.

### Subject Management
1. **Toggle Status**: Single-click the checkbox icon to cycle through statuses (Missing → In Progress → Completed)
2. **Add New Subject**:
   - Click the "Add Subject" button at the bottom of any semester
   - Fill in Course Code (e.g., IS105) and Subject Name
   - Credits auto-extracted from last digit of ID (IS105 → 5 credits)
   - Press "Add Subject" or Enter to save
3. **Edit Subject Name**:
   - Click any subject name to edit inline
   - Edit icon appears on hover
   - Press Enter to save or Escape to cancel
4. **Edit Credits**:
   - Click the credits badge (e.g., "3 Cr") on any card
   - A popover appears with quick-select buttons for 0-6 credits
   - Click any number for instant selection
   - Click "More (7-12) •••" for custom values 7-12
   - Click outside the popover or the badge again to close
5. **Edit Grades**:
   - Click the grade badge on ANY subject (not just completed ones)
   - Type grade (numeric like "95" or text like "Aprobada")
   - Press Enter to save or Escape to cancel
   - Shows "Add grade" if no grade exists
6. **Edit Prerequisites**:
   - Scroll down to the prerequisite section on any card
   - Click "Add prerequisite" to open searchable dropdown
   - Search by course code or name
   - Select subjects from current or previous semesters only
   - Click X on any prerequisite badge to remove it
   - Changes save automatically
7. **Delete Subject**:
   - Hover over a card to reveal action buttons at the bottom right
   - Click the trash icon
   - Confirm deletion in the beautiful modal dialog
8. **Drag & Drop**:
   - Click and hold the grip icon at the bottom right of each card
   - Drag to another semester to move the subject
9. **View Prerequisites**: Locked subjects show which prerequisites are missing (hover for details)
10. **Prerequisite Connection Lines** (NEW):
   - Click the GitBranch icon (🌿) in the navbar to toggle visual connection lines
   - Lines connect each subject to its prerequisites with animated curves
   - Color-coded by status:
     - Green solid lines = prerequisite completed ✅
     - Teal solid lines = prerequisite in progress 🔄
     - Red dashed lines = prerequisite missing/locked ❌
   - Lines auto-update as you scroll and change subject statuses
   - Toggle state persists across devices
11. **Real-time Stats**: Dashboard updates automatically as you make changes

### User Preferences (Synced Across Devices)
- **Student Name**: Click your name in the navbar to edit inline, syncs to all devices
- **Dark Mode**: Click the Moon/Sun icon to toggle, preference syncs across all devices
- **Prerequisite Lines**: Click the GitBranch icon to show/hide prerequisite connections
- Settings are saved to Supabase database and sync in real-time

### Data Persistence
- **Auto-Save**: All changes automatically saved after 1 second (curriculum and config)
- **Cross-Device Sync**: Open on mobile and desktop - settings sync instantly
- **Curriculum**: Saved to `server/data/curriculum.json`
- **Configuration**: Saved to `server/data/config.json`
- **Reset**: Restore default data from backup files

## 🔧 Configuration

### Customizing Data
The curriculum data is stored in `server/data/curriculum.json`. You can:
- Manually edit the JSON file
- Use the in-app drag & drop to reorganize
- Run `npm run dev` and the changes will load automatically

### Customizing Colors
Edit `src/index.css` in the `@theme` block to change the color palette.

### Adding Prerequisites
Update the `PREREQUISITES_MAP` in `src/data.ts`:

```typescript
const PREREQUISITES_MAP: Record<string, string[]> = {
    "SUBJECT_ID": ["PREREQ_ID_1", "PREREQ_ID_2"],
    // ...
};
```

## 🌐 API Endpoints

The Express backend provides these endpoints:

- `GET /api/curriculum` - Load curriculum data
- `POST /api/curriculum` - Save curriculum data
- `POST /api/curriculum/reset` - Reset to backup data
- `GET /api/health` - Health check

## 🐛 Known Issues

- TypeScript configuration warnings in `tsconfig.node.json` (does not affect functionality)
- Some course names are truncated from university HTML source (ending with "...")
- IS184 status changed from completed→in-progress during merge (needs user verification)

## 📊 Current Data Status

- **Total Courses**: 99
- **Completed**: 27 courses
- **In Progress**: 45 courses
- **Missing**: 27 courses
- **Data Source**: Merged from university HTML export (January 18, 2026)
- See `MERGE_SUMMARY.md` for detailed merge report

## 🚧 Future Enhancements

### Completed ✅
- Backend API integration for file-based persistence
- Dark mode toggle with backend sync
- Color-coded status system (Green/Blue/Orange/Red for visual clarity)
- Horizontal semester layout for landscape mode (all 10 semesters always visible)
- Add new subjects functionality with auto-credit detection
- Inline grade and credits editing (all subjects) with popover UI
- Inline subject name editing
- Single-click status toggle
- Delete subjects with custom confirmation modal
- Prerequisites editor with searchable dropdown
- 3-row card layout (name, badges, actions)
- Storage simplified to API-only
- Fixed card dimensions (w-full × h-32)
- Visual prerequisite connection lines with SVG overlay (animated, color-coded)

### Pending 📋
- Edit course IDs
- "What-if" scenario planning
- Semester planning mode
- Within-semester subject reordering
- Export to PDF
- Multiple student profiles
- User authentication
- Cloud storage sync

## 📝 Development Notes

### Key Implementation Details

1. **API-Based Persistence**: Data is saved to `server/data/curriculum.json` via Express API with automatic debouncing
2. **Dark Mode**: Uses Tailwind's `dark:` classes with localStorage persistence and system preference detection
3. **Drag & Drop Logic**: The `handleDragEnd` function checks if the subject's current semester differs from the target before moving
4. **Tailwind v4**: Uses the new `@theme` directive in CSS instead of the traditional config file approach
5. **Vite Proxy**: Frontend proxies `/api` requests to backend during development

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder. For production:
1. Serve the `dist/` folder with a static file server
2. Run the Express server separately: `node server/index.js`
3. Configure environment variables for API URL

### Merging University Data

To update with new university data:

1. Place new HTML export in `server/data/universityData.html`
2. Run the merge script: `node scripts/mergeUniversityData.js`
3. Review the changes in `server/data/curriculum.merged.json`
4. Copy to `curriculum.json` and `curriculum.backup.json` if satisfied

## 📄 License

MIT License - feel free to use this project for your own academic tracking needs!

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Drag and drop by [@dnd-kit](https://dndkit.com/)
- Backend powered by [Express.js](https://expressjs.com/)

---

**Created by Antigravity AI - January 2026**

For detailed technical documentation, see [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
