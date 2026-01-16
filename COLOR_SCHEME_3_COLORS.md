# Color System - 3 Color Scheme

## Overview
The entire project uses **only 3 main colors** defined in `globals.css` with their variants for different shades:

1. **Primary: Blue** (`--primary-600: #3b82f6`)
2. **Secondary: Green** (`--secondary-600: #10b981`)  
3. **Accent: Red** (`--error: #ef4444`)

All these colors are defined with multiple shade variants in the CSS color palette.

## Color Definitions (from globals.css)

### Primary Color - Blue
```css
--primary-50: #f0f7ff      (Very light background)
--primary-100: #e0efff    (Light background)
--primary-400: #60a5fa    (Light variant)
--primary-500: #6366f1    (Indigo variant)
--primary-600: #3b82f6    (Main primary - MOST USED)
--primary-700: #1d4ed8    (Dark variant - hover states)
--primary-900: #1e3a8a    (Very dark variant)
```

### Secondary Color - Green
```css
--secondary-400: #2dd4bf   (Light variant)
--secondary-500: #14b8a6   (Medium variant)
--secondary-600: #10b981   (Main secondary - MOST USED)
```

### Accent Color - Red
```css
--error: #ef4444          (Main error/accent red)
--success: #10b981        (Alias for secondary-600)
--warning: #f59e0b        (NOT USED - kept for legacy)
```

## Usage Guide

### Primary Color (Blue) - Used for:
- Links and CTAs
- Primary buttons (Browse, View, Edit)
- Form input focus states
- Active states
- Primary gradients

**Variants:**
- Text: `var(--primary-600)`
- Backgrounds: `var(--primary-50)`, `var(--primary-100)`
- Hover states: `var(--primary-700)`
- Dark mode: `var(--primary-900)`

### Secondary Color (Green) - Used for:
- Admin buttons (Login, Submit, Upload)
- Success states
- Secondary gradients
- Green action buttons

**Variants:**
- Text: `var(--secondary-600)`
- Backgrounds: `rgba(16, 185, 129, 0.05)` to `rgba(16, 185, 129, 0.1)`
- Hover states: `var(--secondary-500)`

### Accent Color (Red) - Used for:
- Error messages and states
- Delete buttons
- Discount badges
- Warning/dangerous actions

**Usage:**
- Text: `var(--error)` or `white` on red
- Background: `var(--error)`

## Neutral Colors (for text, borders, backgrounds)
```css
--neutral-50: #f9fafb
--neutral-100: #f3f4f6
--neutral-200: #e5e7eb
--neutral-300: #d1d5db
--neutral-400: #9ca3af
--neutral-500: #6b7280
--neutral-600: #4b5563
--neutral-700: #374151
--neutral-800: #1f2937
--neutral-900: #111827

--foreground: #1f2937 (text color)
--text-light: #6b7280 (secondary text)
--background: #ffffff
--background-secondary: #f9fafb
```

## Component Color Map

### Admin Section
| Component | Color | Shade |
|-----------|-------|-------|
| Header | Primary | Linear gradient: Blue + Green |
| Login button | Secondary | Green |
| Submit button | Secondary | Green |
| Delete button | Accent | Red |
| Table header | Primary | Light blue |

### Student Section
| Component | Color | Shade |
|-----------|-------|-------|
| Browse header | Primary | Gradient |
| Buy button | Primary | Blue |
| Download button | Primary | Blue |
| Links | Primary | Blue |
| Price display | Primary | Blue |
| Discount badge | Accent | Red |

### Forms
| Component | Color |
|-----------|-------|
| Input focus | Primary |
| Focus shadow | Primary with 10% opacity |
| Upload area | Secondary |
| Success message | Secondary |
| Error message | Accent |

## Shadow Variants (Using Primary Color)
```css
/* Input focus shadows - BLUE */
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)

/* Button hover shadows - BLUE */
box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3)

/* Upload area focus shadows - GREEN */
box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3)

/* General shadows - GRAY */
box-shadow: 0 X Y rgba(0, 0, 0, 0.1)
```

## Dark Mode Support
All colors have dark mode variants defined in globals.css:
```css
@media (prefers-color-scheme: dark) {
  --background: #0f172a
  --background-secondary: #1e293b
  --foreground: #f1f5f9
  --text-light: #cbd5e1
}
```

## Implementation Rules

✅ **Always use CSS variables** - Never hardcode hex colors
✅ **Use shade variants** - `--primary-600`, `--primary-700`, `--primary-50`
✅ **Consistent opacity** - Use defined RGBA patterns for transparency
✅ **Semantic meanings** - Primary for main actions, Secondary for alternate, Red for danger
❌ **Never use** - `#ef4444`, `#3b82f6`, etc. directly (use variables instead)

## Conversion Examples

### ❌ WRONG
```css
.button {
  background: #3b82f6;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}
```

### ✅ CORRECT
```css
.button {
  background: var(--primary-600);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3); /* Blue shadow */
}

.button.secondary {
  background: var(--secondary-600);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); /* Green shadow */
}

.button.danger {
  background: var(--error);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3); /* Red shadow */
}
```

## All Used Colors Summary

| Purpose | Color | Hex | Variable |
|---------|-------|-----|----------|
| Primary Actions | Blue | #3b82f6 | var(--primary-600) |
| Primary Hover | Dark Blue | #1d4ed8 | var(--primary-700) |
| Primary Background | Light Blue | #f0f7ff | var(--primary-50) |
| Primary Light BG | Light Blue | #e0efff | var(--primary-100) |
| Secondary Actions | Green | #10b981 | var(--secondary-600) |
| Secondary Hover | Teal | #14b8a6 | var(--secondary-500) |
| Danger/Error | Red | #ef4444 | var(--error) |
| Text | Dark Gray | #1f2937 | var(--foreground) |
| Text Secondary | Gray | #6b7280 | var(--text-light) |
| Borders | Light Gray | #d1d5db | var(--neutral-300) |
| Background | White | #ffffff | var(--background) |
| Background Alt | Off-white | #f9fafb | var(--background-secondary) |

## Files Updated for 3-Color System
- ✅ globals.css (defines all color variables)
- ✅ NotesCard.module.css (discount badge: #ef4444 → var(--error))
- ✅ UploadNotesForm.module.css (upload area: blue → green)
- ✅ admin/login/login.module.css (button: blue → green)
- All other files already use proper CSS variables

## Next Steps
Verify that all components follow the 3-color system and no hardcoded colors remain.
