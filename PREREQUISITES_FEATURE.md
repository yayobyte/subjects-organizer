# Prerequisites Editor Feature

**Date**: January 19, 2026  
**Feature**: Inline prerequisite editing with searchable dropdown

## Overview

Added the ability to add, edit, and remove prerequisites for any subject directly from the subject card.

## Features

### 1. Add Prerequisites
- Click "Add prerequisite" button on any subject card
- Search subjects by code (e.g., "IS105") or name (e.g., "Programming")
- Select from subjects in current or previous semesters only
- Cannot select the subject itself
- Cannot select already-added prerequisites

### 2. Remove Prerequisites
- Click the X icon on any prerequisite badge to remove it
- Changes save automatically to backend

### 3. View Prerequisites
- Prerequisites displayed as blue badges with subject code and name
- Truncates long names to fit within card
- Shows all prerequisites in a compact format

### 4. Smart Filtering
- Only shows subjects from current semester or earlier
- For example, a Semestre 5 subject can only have prerequisites from Semesters 1-5
- Prevents circular dependencies (can't select itself)

## User Interface

### Prerequisite Badges
```
[IS105 Programming I] [X]  [CB223 Linear Algebra] [X]
```
- Blue background with border
- Monospace font for course codes
- X button to remove
- Hover to see full name if truncated

### Add Dropdown
```
┌─────────────────────────────────┐
│ 🔍 Search by code or name...    │
├─────────────────────────────────┤
│ IS105    Programming I          │
│          Semestre 1             │
│ IS193    Intro to Info Systems  │
│          Semestre 1             │
│ CB223    Linear Algebra         │
│          Semestre 2             │
└─────────────────────────────────┘
Shows subjects from Semestre X and earlier
```

### Search Features
- Real-time filtering as you type
- Searches both course code and name
- Case-insensitive
- Auto-focus on search input

## Technical Implementation

### New Component
**File**: `src/components/PrerequisiteEditor.tsx`

**Props**:
- `subject: Subject` - The subject to edit prerequisites for

**State**:
- `isAdding` - Controls dropdown visibility
- `searchTerm` - Search input value
- `selectedPrereqs` - Local copy of prerequisites

**Features**:
- Click-outside-to-close dropdown
- Filters available subjects by semester
- Updates context immediately on add/remove
- Auto-saves to backend via context

### Context Updates
**File**: `src/contexts/SubjectContext.tsx`

**New Method**:
```typescript
updatePrerequisites: (id: string, prerequisites: string[]) => void
```

Updates the prerequisites array for a subject and triggers auto-save.

### Subject Card Integration
**File**: `src/components/SubjectCard.tsx`

**Changes**:
- Imported `PrerequisiteEditor` component
- Added as Row 4 after action buttons
- Changed card from `h-32` to `min-h-32` to accommodate varying prerequisite counts

## Data Flow

1. User clicks "Add prerequisite"
2. Dropdown opens with filtered subjects
3. User searches (optional) and selects a subject
4. `handleAddPrerequisite` calls `updatePrerequisites` in context
5. Context updates state and triggers debounced save (1 second)
6. Backend persists to `curriculum.json`

## Persistence

Prerequisites are stored in the `Subject` type:
```typescript
interface Subject {
    id: string;
    name: string;
    semester: string;
    credits: number;
    status: SubjectStatus;
    grade?: number | string;
    prerequisites?: string[]; // Array of subject IDs
}
```

The backend already handles this since it saves the entire subjects array to `server/data/curriculum.json`.

## Usage Examples

### Adding Prerequisites

**Scenario**: Adding prerequisites to "IS304 Data Structures"

1. Find the IS304 card in Semestre 3
2. Click "Add prerequisite"
3. Search for "IS284" or "Programming II"
4. Click the subject in the dropdown
5. Prerequisite badge appears: `[IS284 Programming II] [X]`
6. Repeat for "IS142 Logic"
7. Both prerequisites now visible on card

### Removing Prerequisites

1. Find the prerequisite badge on the card
2. Click the X icon
3. Prerequisite immediately removed and saved

### Locked Subject Behavior

If a subject has prerequisites that aren't completed:
- Shows "🔒 Locked" badge
- Status cannot be changed (unless already completed)
- Locked indicator shows which prerequisites are missing (hover tooltip)

## Validation

- ✅ Cannot add duplicate prerequisites
- ✅ Cannot add self as prerequisite
- ✅ Can only add subjects from current or previous semesters
- ✅ Empty prerequisites array is valid (subject has no prerequisites)
- ✅ Changes persist to backend automatically

## UI Behavior

### Card Height
- Cards now use `min-h-32` instead of `h-32`
- Expands vertically to show all prerequisites
- Maintains consistent width

### Dropdown Position
- Opens above the "Add prerequisite" button
- Fixed width (288px / w-72)
- Max height 256px with scroll
- Z-index 50 to appear above other cards

### Mobile Considerations
- Touch-friendly button sizes
- Scrollable subject list
- Search works on mobile keyboards

## Future Enhancements

Potential improvements:
- Drag-and-drop to reorder prerequisites
- Bulk add from PREREQUISITES_MAP
- Show prerequisite chain visualization
- Import/export prerequisites as CSV
- "Suggested prerequisites" based on subject similarity

## Keyboard Shortcuts

None currently. Potential additions:
- ESC to close dropdown
- Arrow keys to navigate subject list
- Enter to select highlighted subject

## Files Modified

- ✅ `src/components/PrerequisiteEditor.tsx` - New component
- ✅ `src/components/SubjectCard.tsx` - Integrated editor, changed to min-h-32
- ✅ `src/contexts/SubjectContext.tsx` - Added updatePrerequisites method

## Testing Checklist

- [x] Add prerequisite to subject
- [x] Remove prerequisite from subject
- [x] Search by course code
- [x] Search by subject name
- [x] Cannot add self as prerequisite
- [x] Cannot add duplicate
- [x] Only shows current/previous semester subjects
- [x] Click outside closes dropdown
- [x] Changes persist to backend
- [x] Prerequisite badges display correctly
- [x] Locked indicator works with new prerequisites
- [x] Card expands to fit multiple prerequisites

---

**Status**: ✅ Fully implemented and integrated  
**Performance**: Optimistic updates with 1-second debounced save  
**Compatibility**: Works with existing prerequisite checking system
