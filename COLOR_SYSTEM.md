# Color-Coded Status System

**Implementation Date**: January 19, 2026
**Feature**: Visual status indicators with distinct background colors

## Overview

The curriculum tracker now features a comprehensive color-coded system that makes it easy to identify the status of each subject at a glance. Each subject card displays a distinct background color based on its current state and prerequisite status.

## Color Meanings

### 🟢 Green - Completed
- **Status**: `completed`
- **Light Mode**: `emerald-50/90` background with `emerald-300` border
- **Dark Mode**: `emerald-950/40` background with `emerald-800/50` border
- **Meaning**: Courses you've successfully completed and approved
- **Checkbox**: Green circle with checkmark (`emerald-500`)
- **Badges**: Emerald-tinted grade and credit badges

### 🔵 Blue - In Progress
- **Status**: `in-progress`
- **Light Mode**: `sky-50/90` background with `sky-300` border
- **Dark Mode**: `sky-950/40` background with `sky-800/50` border
- **Meaning**: Courses you're currently taking this semester
- **Checkbox**: Blue circle with checkmark (`sky-500`)
- **Badges**: Sky-blue tinted grade and credit badges

### 🟡 Amber/Orange - Ready
- **Status**: `missing` with all prerequisites met
- **Light Mode**: `amber-50/90` background with `amber-300` border
- **Dark Mode**: `amber-950/40` background with `amber-800/50` border
- **Meaning**: Courses available to take - all prerequisites are completed!
- **Checkbox**: Amber circle (`amber-100`)
- **Badges**: Amber-tinted grade and credit badges
- **Special**: Shows animated amber connector line on hover

### 🔴 Red - Locked
- **Status**: `missing` with unmet prerequisites
- **Light Mode**: `red-50/90` background with `red-300` border
- **Dark Mode**: `red-950/40` background with `red-800/50` border
- **Meaning**: Courses you can't take yet - prerequisites haven't been completed
- **Checkbox**: Red circle, disabled (`red-200`)
- **Locked Badge**: Red "Locked" indicator with alert icon
- **Interaction**: Cannot toggle status until prerequisites are met

## Implementation Details

### File Modified
- **src/components/SubjectCard.tsx**

### State Calculations
```typescript
const isLocked = missingPrereqs.length > 0;
const isCompleted = subject.status === 'completed';
const isInProgress = subject.status === 'in-progress';
const isReady = subject.status === 'missing' && !isLocked;
const isLockedMissing = subject.status === 'missing' && isLocked;
```

### Background Color Logic
The card background uses a 4-way conditional to apply the appropriate color:
1. Check if completed → Green
2. Check if in-progress → Blue
3. Check if ready (missing + unlocked) → Amber/Orange
4. Check if locked (missing + locked) → Red
5. Fallback → Slate gray

### Color Palette
Using Tailwind CSS built-in color scales:

| Status | Light BG | Dark BG | Light Border | Dark Border |
|--------|----------|---------|--------------|-------------|
| Completed | `emerald-50/90` | `emerald-950/40` | `emerald-300` | `emerald-800/50` |
| In Progress | `sky-50/90` | `sky-950/40` | `sky-300` | `sky-800/50` |
| Ready | `amber-50/90` | `amber-950/40` | `amber-300` | `amber-800/50` |
| Locked | `red-50/90` | `red-950/40` | `red-300` | `red-800/50` |

All backgrounds use `/90` opacity for light mode and `/40` for dark mode to maintain the glassmorphism effect and backdrop blur.

## UI Elements Affected

### 1. Card Background
- Main container background color
- Border color
- Hover shadow color (matching the status color)

### 2. Checkbox Button
- Background color matches status
- White checkmark on completed/in-progress
- Colored circle on ready/locked
- Disabled state on locked subjects

### 3. Grade Badge
- Background tint matches status color
- Border matches status color
- Focus ring matches status color (when editing)
- Dynamic styling for both edit and display states

### 4. Credits Badge
- Same color coordination as grade badge
- Consistent with overall card theme

### 5. Locked Indicator
- Red color (`red-600` light, `red-400` dark)
- Shows "Locked" text with alert icon
- Tooltip displays missing prerequisites

### 6. Connector Line
- Only visible on "Ready" subjects (amber cards)
- Animated gradient on hover
- Amber color (`amber-400`)

## Status Cycling Behavior

Clicking the checkbox cycles through statuses:
```
Missing → In Progress → Completed → Missing
```

Colors update automatically:
```
Red/Amber → Blue → Green → Red/Amber
```

(Red if prerequisites not met, Amber if prerequisites are met)

## Dark Mode Support

The color system fully supports dark mode with automatically adjusted:
- Background opacity (lighter in dark mode for contrast)
- Border colors (darker in dark mode)
- Text colors (inverted for readability)
- Shadow effects (subtle glow instead of drop shadows)

All color adjustments use Tailwind's `dark:` variant for seamless theme switching.

## Accessibility Considerations

1. **Color + Icon**: Status is indicated by both color AND visual icons/badges, not color alone
2. **Contrast**: All text maintains WCAG AA contrast ratios on colored backgrounds
3. **Tooltips**: Locked subjects show tooltip explaining which prerequisites are missing
4. **Interactive States**: Clear hover and focus states on all interactive elements

## Benefits

### User Experience
- **Instant Recognition**: Quickly identify subject status across all semesters
- **Visual Hierarchy**: Color draws attention to actionable items (ready subjects)
- **Progress Tracking**: Easy to see completed vs. in-progress at a glance
- **Prerequisite Awareness**: Red cards immediately signal blocked courses

### Development
- **Maintainable**: Uses standard Tailwind color scales
- **Consistent**: All UI elements match the primary status color
- **Extensible**: Easy to add new status types or adjust colors
- **Performant**: Pure CSS, no JavaScript color calculations

## Future Enhancements

Possible additions to the color system:
- Custom color themes (let users choose their own color scheme)
- Color-blind friendly mode (patterns + colors)
- Status filters by color
- Color-coded semester headers based on completion percentage
- Animation transitions when status changes

## Testing Checklist

- [x] Green cards display for completed subjects
- [x] Blue cards display for in-progress subjects
- [x] Amber/orange cards display for ready subjects (prerequisites met)
- [x] Red cards display for locked subjects (prerequisites not met)
- [x] Colors work correctly in light mode
- [x] Colors work correctly in dark mode
- [x] Checkbox colors match card background
- [x] Badge colors match card background
- [x] Locked indicator is red
- [x] Connector line only shows on ready (amber) subjects
- [x] Status cycling updates colors correctly
- [x] Hover states work on all colored cards
- [x] Text is readable on all backgrounds

---

**Documentation Updated**: January 19, 2026
**Status**: ✅ Implemented and Tested
