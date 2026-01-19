# Color-Coded Status System

**Implementation Date**: January 19, 2026
**Last Updated**: January 19, 2026
**Feature**: Visual status indicators with custom design system colors

## Overview

The curriculum tracker features a comprehensive color-coded system using custom design system colors that makes it easy to identify the status of each subject at a glance. Each subject card displays a distinct background color based on its current state and prerequisite status.

All colors now use the custom design system palette instead of standard Tailwind colors for brand consistency.

## Color Meanings

### 🟢 Green - Completed
- **Status**: `completed`
- **Light Mode**: `emerald-50/90` background with `emerald-300` border
- **Dark Mode**: `emerald-950/40` background with `emerald-800/50` border
- **Meaning**: Courses you've successfully completed and approved
- **Checkbox**: Green circle with checkmark (`emerald-500`)
- **Badges**: Emerald-tinted grade and credit badges

### 🔵 Teal - In Progress
- **Status**: `in-progress`
- **Design System Color**: `dark-teal`
- **Light Mode**: `dark-teal-50/90` background with `dark-teal-300` border
- **Dark Mode**: `dark-teal-950/40` background with `dark-teal-800/50` border
- **Meaning**: Courses you're currently taking this semester
- **Checkbox**: Teal circle with checkmark (`dark-teal-500`)
- **Badges**: No grade badge shown (in progress)

### 🟠 Orange - Ready
- **Status**: `missing` with all prerequisites met
- **Design System Color**: `princeton-orange`
- **Light Mode**: `princeton-orange-50/90` background with `princeton-orange-300` border
- **Dark Mode**: `princeton-orange-950/40` background with `princeton-orange-800/50` border
- **Meaning**: Courses available to take - all prerequisites are completed!
- **Checkbox**: Orange circle (`princeton-orange-100`)
- **Badges**: No grade badge shown (not yet taken)
- **Special**: Shows animated orange connector line on hover

### 🔴 Crimson - Locked
- **Status**: `missing` with unmet prerequisites
- **Design System Color**: `deep-crimson`
- **Light Mode**: `deep-crimson-50/90` background with `deep-crimson-300` border
- **Dark Mode**: `deep-crimson-950/40` background with `deep-crimson-800/50` border
- **Meaning**: Courses you can't take yet - prerequisites haven't been completed
- **Checkbox**: Crimson circle, disabled (`deep-crimson-200`)
- **Locked Badge**: Deep crimson "Locked" indicator with alert icon (`deep-crimson-600`)
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
Using custom design system colors:

| Status | Design Color | Light BG | Dark BG | Light Border | Dark Border |
|--------|-------------|----------|---------|--------------|-------------|
| Completed | Emerald | `emerald-50/90` | `emerald-950/40` | `emerald-300` | `emerald-800/50` |
| In Progress | Dark Teal | `dark-teal-50/90` | `dark-teal-950/40` | `dark-teal-300` | `dark-teal-800/50` |
| Ready | Princeton Orange | `princeton-orange-50/90` | `princeton-orange-950/40` | `princeton-orange-300` | `princeton-orange-800/50` |
| Locked | Deep Crimson | `deep-crimson-50/90` | `deep-crimson-950/40` | `deep-crimson-300` | `deep-crimson-800/50` |

All backgrounds use `/90` opacity for light mode and `/40` for dark mode to maintain the glassmorphism effect and backdrop blur.

### Design System Color Definitions
The custom colors are defined in `src/index.css` using Tailwind v4's `@theme` directive with full color scales (50-950).

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

**Latest Update**: Dark mode now fully implemented with Tailwind v4

The color system fully supports dark mode with automatically adjusted:
- Background opacity (lighter in dark mode for contrast)
- Border colors (darker in dark mode)
- Text colors (inverted for readability)
- Shadow effects (subtle glow instead of drop shadows)

### Dark Mode Implementation (Tailwind v4)
- Added `@variant dark (&:is(.dark *));` directive in `src/index.css`
- Dark mode class applied to `<html>` element via JavaScript
- Persisted in localStorage for instant application on page load
- Synced with Supabase backend for cross-device consistency
- All `dark:` variants work correctly with custom design system colors

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
- **Maintainable**: Uses custom design system color scales
- **Consistent**: All UI elements match the primary status color
- **Brand Aligned**: Uses princeton-orange, dark-teal, crimson-violet, autumn-leaf, deep-crimson
- **Extensible**: Easy to add new status types or adjust colors
- **Performant**: Pure CSS, no JavaScript color calculations

## Stats Dashboard Colors

The stats overview cards also use the custom design system colors:

| Card | Color | Purpose |
|------|-------|---------|
| Progress | `emerald-600/700` | Shows overall completion percentage |
| In Progress | `dark-teal-600/700` | Displays current semester courses |
| Average Grade | `princeton-orange-600/700` | Shows cumulative GPA |
| Completed | `crimson-violet-600/700` | Total completed subjects |
| Remaining | `autumn-leaf-600/700` | Subjects left to graduate |

All stat cards feature:
- Filled solid backgrounds (no semi-transparency)
- White text with 90% opacity for readability
- Hover effects (scale + shadow)
- Mobile-optimized 2-column grid layout
- Responsive font sizing

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

## Recent Updates (January 19, 2026)

### Custom Design System Colors Migration
- ✅ Replaced standard Tailwind colors with custom brand colors
- ✅ In Progress: sky → dark-teal
- ✅ Ready: amber → princeton-orange
- ✅ Locked: red → deep-crimson
- ✅ Completed: kept emerald (already appropriate)

### Dark Mode Implementation
- ✅ Added Tailwind v4 `@variant dark` directive
- ✅ Implemented localStorage caching for instant dark mode
- ✅ Synced with Supabase backend for persistence
- ✅ Fixed dark mode toggle functionality

### Stats Dashboard Updates
- ✅ Added new "In Progress" stat card
- ✅ Applied design system colors to all stat cards
- ✅ Optimized mobile layout (2-column grid)
- ✅ Updated to filled solid backgrounds

### Badge Visibility Rules
- ✅ Grade badges only show on completed subjects
- ✅ No grade badge for in-progress subjects (still being graded)
- ✅ No grade badge for ready subjects (not yet taken)
- ✅ No grade badge for locked subjects (prerequisites not met)

---

**Documentation Updated**: January 19, 2026
**Status**: ✅ Fully Implemented and Tested
