# Visual Curriculum & Prerequisite Tracker

A modern, interactive web application for tracking academic progress and visualizing course dependencies. Built with React, TypeScript, and Tailwind CSS v4.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)

## ✨ Features

### 📚 Dual View Modes
- **List View**: Organized semester-by-semester curriculum display with drag-and-drop reordering
- **Graph View**: Interactive node-based visualization showing prerequisite dependencies

### 🎯 Smart Subject Management
- **Status Tracking**: Toggle subjects between Missing, In Progress, and Completed states
- **Prerequisite Locking**: Subjects automatically lock if prerequisites aren't met
- **Real-time Statistics**: Live calculation of progress, GPA, credits, and remaining subjects

### 🎨 Premium Design
- **Glassmorphism UI**: Modern, translucent design with backdrop blur effects
- **Custom Color Palette**: Carefully curated colors (Crimson Violet, Deep Crimson, Princeton Orange, Autumn Leaf, Dark Teal)
- **Smooth Animations**: Powered by Framer Motion for cinematic transitions
- **Responsive Layout**: Fully optimized for desktop and mobile devices

### 🔄 Data Persistence
- **LocalStorage**: Automatic saving of all changes in your browser
- **Import/Export**: Download and upload your curriculum as JSON files
- **Reset Function**: Quickly restore default curriculum data

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

## 🏗️ Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS v4 (with @tailwindcss/postcss)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **State Management**: React Context API

## 📁 Project Structure

```
assignments/
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx       # Main app shell with navigation
│   │   ├── SemesterListView.tsx  # List view with DnD
│   │   ├── CurriculumGraph.tsx   # Graph visualization
│   │   ├── SubjectCard.tsx       # Individual subject card
│   │   ├── StatsDashboard.tsx    # Progress statistics
│   │   ├── DroppableSemester.tsx # DnD semester container
│   │   └── JSONActions.tsx       # Import/Export buttons
│   ├── contexts/
│   │   └── SubjectContext.tsx    # Global state management
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── data.ts              # Student data & prerequisites
│   ├── types.ts             # TypeScript interfaces
│   ├── index.css            # Global styles & Tailwind config
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── PROJECT_CONTEXT.md       # Detailed project documentation
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## 🎮 Usage Guide

### List View
1. **Toggle Status**: Click the circle icon on any subject card to cycle through statuses
2. **Drag & Drop**: Hover over a card to reveal the grip icon (⋮⋮), then drag to another semester
3. **View Prerequisites**: Locked subjects show which prerequisites are missing

### Graph View
1. **Hover Interaction**: Hover over any subject node to highlight its prerequisite chain
2. **Visual Indicators**: Completed subjects are green, locked subjects are dimmed

### Data Management
1. **Export**: Click the download icon (⬇) to save your curriculum as JSON
2. **Import**: Click the upload icon (⬆) to load a previously saved JSON file
3. **Reset**: Click the reset icon (↻) to restore default data

## 🔧 Configuration

### Customizing Data
Edit `src/data.ts` to modify:
- Student information
- Subject list
- Prerequisite relationships
- Semester organization

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

## 🐛 Known Issues

- TypeScript configuration warnings in `tsconfig.node.json` (does not affect functionality)
- Graph view nodes are not draggable (by design - use List view for reordering)

## 🚧 Future Enhancements

- [ ] Backend API integration for multi-device sync
- [ ] "What-if" scenario planning
- [ ] Semester planning mode
- [ ] Within-semester subject reordering
- [ ] Export to PDF
- [ ] Dark mode toggle
- [ ] Multiple student profiles

## 📝 Development Notes

### Key Implementation Details

1. **LocalStorage Persistence**: Data is initialized from localStorage in the `useState` initializer to prevent race conditions
2. **Drag & Drop Logic**: The `handleDragEnd` function checks if the subject's current semester differs from the target before moving
3. **Prerequisite Highlighting**: Uses SVG path rendering with dynamic opacity based on hover state
4. **Tailwind v4**: Uses the new `@theme` directive in CSS instead of the traditional config file approach

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder, ready for deployment to any static hosting service.

## 📄 License

MIT License - feel free to use this project for your own academic tracking needs!

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Drag and drop by [@dnd-kit](https://dndkit.com/)

---

**Created by Antigravity AI - January 2026**

For detailed technical documentation, see [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
