# 🎨 Color Palette & Design System

## Primary Colors

### Blue - Brand Color
- `--primary-900`: #1e3a8a (Darkest - used for text)
- `--primary-700`: #1d4ed8 (Dark - hover states)
- `--primary-600`: #3b82f6 (Main - buttons, links)
- `--primary-500`: #6366f1 (Light - backgrounds)
- `--primary-400`: #60a5fa (Lighter - hover effects)

**Usage:**
```tsx
// Button
style={{ background: 'var(--primary-600)' }}

// Text link
style={{ color: 'var(--primary-600)' }}

// Hover state
style={{ background: 'var(--primary-700)' }}
```

---

## Secondary Colors

### Green - Success/Action
- `--secondary-600`: #10b981 (Main)
- `--secondary-500`: #14b8a6 (Light)
- `--secondary-400`: #2dd4bf (Lighter)

**Usage:**
```tsx
// Success messages
style={{ background: 'var(--secondary-600)' }}

// Badge
style={{ 
  background: 'var(--secondary-100)',
  color: 'var(--secondary-700)'
}}
```

---

## Accent Colors

### For Highlights & Visual Interest
- `--accent-orange`: #f97316 (Warning/Attention)
- `--accent-purple`: #a855f7 (Premium/Highlight)
- `--accent-pink`: #ec4899 (Featured)

---

## Status Colors

- `--success`: #10b981 ✅ (Green - Positive)
- `--warning`: #f59e0b ⚠️ (Amber - Caution)
- `--error`: #ef4444 ❌ (Red - Negative)

**Usage:**
```tsx
// Success alert
style={{ background: 'var(--success)', color: 'white' }}

// Error message
style={{ background: 'var(--error)', color: 'white' }}

// Warning banner
style={{ background: 'var(--warning)' }}
```

---

## Neutral Colors (Grayscale)

### Light Variants (Backgrounds)
- `--neutral-50`: #f9fafb (Almost white)
- `--neutral-100`: #f3f4f6 (Light background)
- `--neutral-200`: #e5e7eb (Light border)

### Mid Variants (Borders & Dividers)
- `--neutral-300`: #d1d5db (Border color)
- `--neutral-400`: #9ca3af (Disabled text)

### Dark Variants (Text)
- `--neutral-500`: #6b7280 (Secondary text)
- `--neutral-600`: #4b5563 (Muted heading)
- `--neutral-700`: #374151 (Body text)
- `--neutral-800`: #1f2937 (Dark text)
- `--neutral-900`: #111827 (Nearly black)

**Usage:**
```tsx
// Border
style={{ borderColor: 'var(--neutral-300)' }}

// Secondary text
style={{ color: 'var(--text-light)' }} // Maps to --neutral-500

// Dark heading
style={{ color: 'var(--foreground)' }} // Maps to --neutral-900
```

---

## Semantic Variables

### Background
- `--background`: #ffffff (White - content areas)
- `--background-secondary`: #f9fafb (Gray - alternate sections)

### Text
- `--foreground`: #1f2937 (Dark text - headings)
- `--text-light`: #6b7280 (Gray text - descriptions)

---

## Shadows

### Elevation Scale
- `--shadow-sm`: 0 1px 2px (Cards on hover)
- `--shadow-md`: 0 4px 6px (Default cards)
- `--shadow-lg`: 0 10px 15px (Raised cards)
- `--shadow-xl`: 0 20px 25px (Modal/Important)

**Usage:**
```tsx
// Regular card
boxShadow: 'var(--shadow-md)'

// Hover state
boxShadow: 'var(--shadow-lg)'

// Modal overlay
boxShadow: 'var(--shadow-xl)'
```

---

## Component Color Combinations

### Button Styles

#### Primary Button (Blue)
```tsx
{
  background: 'var(--primary-600)',
  color: 'white',
  boxShadow: 'var(--shadow-md)',
  hoverBackground: 'var(--primary-700)',
  hoverShadow: 'var(--shadow-lg)'
}
```

#### Secondary Button (Green)
```tsx
{
  background: 'var(--secondary-600)',
  color: 'white',
  boxShadow: 'var(--shadow-md)',
  hoverBackground: 'var(--secondary-500)'
}
```

#### Outline Button
```tsx
{
  border: '2px solid var(--primary-600)',
  color: 'var(--primary-600)',
  background: 'transparent',
  hoverBackground: 'rgba(59, 130, 246, 0.1)'
}
```

#### Danger Button (Red)
```tsx
{
  background: 'var(--error)',
  color: 'white'
}
```

---

### Badge Styles

#### Subject Badge (Blue)
```tsx
{
  background: 'var(--primary-100)', // Light blue
  color: 'var(--primary-700)'        // Dark blue
}
```

#### Price Badge (Green)
```tsx
{
  background: 'var(--secondary-100)', // Light green
  color: 'var(--secondary-700)'       // Dark green
}
```

---

### Input States

#### Normal
```tsx
{
  borderColor: 'var(--neutral-300)',
  backgroundColor: 'var(--background)'
}
```

#### Focus
```tsx
{
  borderColor: 'var(--primary-600)',
  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
}
```

#### Error
```tsx
{
  borderColor: 'var(--error)',
  boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
}
```

#### Disabled
```tsx
{
  backgroundColor: 'var(--neutral-100)',
  color: 'var(--neutral-400)',
  cursor: 'not-allowed'
}
```

---

### Alert Messages

#### Success
```tsx
{
  background: 'var(--success)',
  color: 'white',
  borderLeft: '4px solid var(--success)'
}
```

#### Error
```tsx
{
  background: 'var(--error)',
  color: 'white',
  borderLeft: '4px solid var(--error)'
}
```

#### Warning
```tsx
{
  background: 'var(--warning)',
  color: 'white',
  borderLeft: '4px solid var(--warning)'
}
```

---

## Dark Mode (Future Implementation)

When dark mode is enabled, these variables are overridden:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;           /* Very dark blue */
    --background-secondary: #1e293b; /* Dark blue-gray */
    --foreground: #f1f5f9;           /* Light blue-white */
    --text-light: #cbd5e1;           /* Light gray */
  }
}
```

---

## Quick Reference Table

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | #ffffff | #0f172a |
| Secondary BG | #f9fafb | #1e293b |
| Text | #1f2937 | #f1f5f9 |
| Muted Text | #6b7280 | #cbd5e1 |
| Border | #d1d5db | #475569 |
| Primary | #3b82f6 | #3b82f6 |
| Success | #10b981 | #10b981 |
| Error | #ef4444 | #ef4444 |

---

## Implementation Tips

### 1. Always Use Variables
```tsx
// ✅ Good
style={{ color: 'var(--foreground)' }}

// ❌ Avoid
style={{ color: '#1f2937' }}
```

### 2. Consistent Spacing
```tsx
// Use consistent spacing scales
p-4, p-6, p-8  // padding
gap-4, gap-6   // gaps
mb-4, mb-6     // margins
```

### 3. Responsive Design
```tsx
// Mobile first, then scale up
className="text-sm sm:text-base lg:text-lg"
```

### 4. Accessibility
```tsx
// Ensure sufficient contrast
// Dark text on light background
// Light text on dark background
// Test with accessibility tools
```

---

## File Location

All color variables are defined in:
`src/app/globals.css`

To modify colors, edit the CSS variables in the `:root` selector.

---

**Last Updated:** January 11, 2026
**Status:** ✅ Implementation Complete
