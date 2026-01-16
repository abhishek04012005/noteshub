# Quick Color Reference - 3 Color System

## 🎨 The 3 Colors

| # | Color | Hex | CSS Variable | Usage |
|---|-------|-----|--------------|-------|
| 1️⃣ | 🔵 Blue | #3b82f6 | `var(--primary-600)` | Primary actions, links |
| 2️⃣ | 🟢 Green | #10b981 | `var(--secondary-600)` | Admin actions, success |
| 3️⃣ | 🔴 Red | #ef4444 | `var(--error)` | Errors, delete, danger |

## 💻 Copy-Paste Examples

### Blue Button (Primary)
```css
.button {
  background: var(--primary-600);
  color: white;
}

.button:hover {
  background: var(--primary-700);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}
```

### Green Button (Admin/Submit)
```css
.button.secondary {
  background: var(--secondary-600);
  color: white;
}

.button.secondary:hover {
  background: var(--secondary-500);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}
```

### Red Button (Delete/Danger)
```css
.button.danger {
  background: var(--error);
  color: white;
}

.button.danger:hover {
  background: #d32f2f;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
}
```

### Blue Link
```css
a {
  color: var(--primary-600);
}

a:hover {
  color: var(--primary-700);
}
```

### Focus Ring (Blue)
```css
input:focus {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Upload Area (Green Border)
```css
.uploadArea {
  border: 2px dashed var(--secondary-600);
}

.uploadArea:hover {
  border-color: var(--secondary-500);
  background: rgba(16, 185, 129, 0.05);
}
```

### Badge - Info (Blue)
```css
.badge.info {
  background: var(--primary-100);
  color: var(--primary-700);
}
```

### Badge - Success (Green)
```css
.badge.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--secondary-600);
}
```

### Badge - Error (Red)
```css
.badge.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}
```

## 📋 Color Variables Reference

### Primary (Blue) Shades
```css
--primary-50:   #f0f7ff   /* Lightest */
--primary-100:  #e0efff   /* Very light */
--primary-400:  #60a5fa   /* Light */
--primary-500:  #6366f1   /* Indigo */
--primary-600:  #3b82f6   /* MAIN (Use this) */
--primary-700:  #1d4ed8   /* Dark (For hover) */
--primary-900:  #1e3a8a   /* Very dark */
```

### Secondary (Green) Shades
```css
--secondary-400:  #2dd4bf  /* Light */
--secondary-500:  #14b8a6  /* Medium (For hover) */
--secondary-600:  #10b981  /* MAIN (Use this) */
```

### Neutral Colors
```css
--neutral-200:  #e5e7eb  /* Light borders */
--neutral-300:  #d1d5db  /* Standard borders */
--neutral-400:  #9ca3af  /* Muted text */
--neutral-500:  #6b7280  /* Secondary text */
```

### Background & Text
```css
--background:           #ffffff    /* Main background */
--background-secondary: #f9fafb    /* Alt background */
--foreground:           #1f2937    /* Main text */
--text-light:           #6b7280    /* Secondary text */
```

### Semantic
```css
--error:   #ef4444  /* Red (Errors, delete) */
--success: #10b981  /* Green (Alias for secondary) */
```

## ✅ Rules to Follow

✅ **DO:**
- Use CSS variables: `var(--primary-600)`
- Use shade variants: `--primary-700` for hover
- Use RGBA for shadows: `rgba(59, 130, 246, 0.3)`
- Keep it consistent

❌ **DON'T:**
- Hardcode colors: `#3b82f6`
- Use wrong shades: `--primary-500` for main button
- Invent new colors
- Forget the 3-color rule

## 🎯 Component Colors at a Glance

```
┌─ BUTTONS ─────────────────────┐
│ Primary (Blue):     #3b82f6    │
│ Secondary (Green):  #10b981    │
│ Danger (Red):       #ef4444    │
│ Hover variant:      -700 shade │
└────────────────────────────────┘

┌─ LINKS ────────────────────────┐
│ Default:      var(--primary-600) │
│ Hover:        var(--primary-700) │
└────────────────────────────────┘

┌─ INPUTS ────────────────────────┐
│ Border:       --neutral-300       │
│ Focus:        --primary-600       │
│ Focus ring:   rgba(59,130,246,0.1)│
└────────────────────────────────┘

┌─ BADGES ────────────────────────┐
│ Info (Blue):  var(--primary-100) bg │
│ Success (Grn):rgba(16,185,129,0.1)  │
│ Error (Red): rgba(239,68,68,0.1)    │
└────────────────────────────────┘

┌─ SHADOWS ───────────────────────┐
│ Blue button:  rgba(59,130,246,0.3)  │
│ Green button: rgba(16,185,129,0.3)  │
│ General:      rgba(0,0,0,0.1)       │
└────────────────────────────────┘
```

## 🔗 Related Files
- `src/app/globals.css` - All color definitions
- `COLOR_SCHEME_3_COLORS.md` - Detailed color system
- `COLOR_PALETTE_VISUAL_GUIDE.md` - Visual reference
- `COLOR_REFACTORING_COMPLETE.md` - What was changed

## 📱 Dark Mode

The same 3 colors work in dark mode! Only backgrounds change:

```css
Light Mode:  --background: #ffffff
Dark Mode:   --background: #0f172a

Blue, Green, Red stay the same in both modes!
```

---

**Last Updated:** Jan 16, 2026
**Status:** ✅ Complete
