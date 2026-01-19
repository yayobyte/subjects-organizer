# Visual Curriculum & Prerequisite Tracker

A modern, interactive web application for tracking academic progress with seamless data persistence. Built with React, TypeScript, Tailwind CSS v4, and Express backend.

**Last Updated**: January 19, 2026 (Evening) - Credits UI improved, storage simplified, layout refined

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
- **One-Click Status Toggle**: Single click to cycle subjects between Missing, In Progress, and Completed states
- **Add New Subjects**: Simplified inline form with auto-credit detection from course ID
- **Edit Subject Names**: Click any subject name to edit inline
- **Edit Credits**: Click any subject's credit badge to edit (validates 0-12 credits)
- **Edit Grades**: Click grade badge on ANY subject to add or modify grades (supports numeric or text)
- **Delete Subjects**: Beautiful confirmation modal with smooth animations
- **Inline Editing**: Keyboard shortcuts (Enter to save, Escape to cancel) for quick updates
- **Prerequisite Locking**: Subjects automatically lock if prerequisites aren't met
- **Real-time Statistics**: Live calculation of progress, GPA, credits, and remaining subjects
- **99 Total Courses**: Complete curriculum imported from university data

### 🎨 Premium Design
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Glassmorphism UI**: Modern, translucent design with backdrop blur effects
- **Custom Color Palette**: Carefully curated colors (Crimson Violet, Deep Crimson, Princeton Orange, Autumn Leaf, Dark Teal)
- **Smooth Animations**: Powered by Framer Motion for cinematic transitions
- **Responsive Layout**: Fully optimized for desktop and mobile devices

### 🔄 Data Persistence
- **Backend API**: Express server with file-based persistence to `server/data/curriculum.json`
- **Auto-Save**: Changes automatically saved to file (debounced by 1 second)
- **Reset Function**: Restore default curriculum data from backup

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

# Start development server (runs both frontend and backend)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at:
- **Frontend**: `http://localhost:5173` (or next available port)
- **Backend API**: `http://localhost:3001`

### Development Commands

```bash
npm run dev      # Run both frontend and backend concurrently
npm run client   # Run only frontend (Vite)
npm run server   # Run only backend (Express)
npm run build    # Build for production
npm run preview  # Preview production build
```

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
- **Server**: Express.js 5.2
- **CORS**: Enabled for development
- **Data Storage**: JSON file-based persistence
- **API Endpoints**: RESTful API for curriculum operations

## 📁 Project Structure

```
assignments/
├── src/
│   ├── components/           # React components
│   │   ├── Layout.tsx       # Main app shell with navigation (full-width)
│   │   ├── DarkModeToggle.tsx  # Dark mode toggle component
│   │   ├── SemesterListView.tsx  # Horizontal list view with DnD
│   │   ├── SubjectCard.tsx       # Subject card with full inline editing + delete
│   │   ├── AddSubjectButton.tsx  # Add subject form (auto-credit detection)
│   │   ├── ConfirmDialog.tsx     # Custom confirmation modal for deletions
│   │   ├── StatsDashboard.tsx    # Progress statistics
│   │   └── DroppableSemester.tsx # DnD semester container
│   ├── contexts/
│   │   └── SubjectContext.tsx    # Global state management
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── storage.ts       # API storage adapter
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
6. **Delete Subject**:
   - Hover over a card to reveal action buttons at the bottom right
   - Click the trash icon
   - Confirm deletion in the beautiful modal dialog
7. **Drag & Drop**:
   - Click and hold the grip icon at the bottom right of each card
   - Drag to another semester to move the subject
8. **View Prerequisites**: Locked subjects show which prerequisites are missing
9. **Real-time Stats**: Dashboard updates automatically as you make changes

### Dark Mode
- Click the Moon/Sun icon in the top-right corner to toggle between light and dark modes
- Your preference is saved to localStorage and persists across sessions

### Data Persistence
- All changes are automatically saved to `server/data/curriculum.json` after 1 second
- No manual save button needed - everything persists automatically
- Reset button restores data from `curriculum.backup.json`

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
- Dark mode toggle
- Horizontal semester layout for landscape mode (all 10 semesters always visible)
- Add new subjects functionality with auto-credit detection
- Inline grade and credits editing (all subjects) with popover UI
- Inline subject name editing
- Single-click status toggle
- Delete subjects with custom confirmation modal
- 3-row card layout (name, badges, actions)
- Storage simplified to API-only
- Fixed card dimensions (w-full × h-32)

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
