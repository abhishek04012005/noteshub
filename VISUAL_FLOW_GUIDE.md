# Syllabus Admin Section - Visual Flow Guide

## 📋 Complete User Flow

```
ADMIN LOGIN
    ↓
ADMIN DASHBOARD (with new AdminNavbar)
    ├── [Upload Notes] → Old upload notes page
    ├── [Upload Syllabus] ← NEW
    │   └── /admin/dashboard/upload-syllabus
    │       └── UploadSyllabusForm
    │           └── Form fields:
    │               - University (input with autocomplete)
    │               - Course (input with autocomplete) ← NEW
    │               - Branch (input with autocomplete)
    │               - Semester (select dropdown)
    │               - PDF File (file upload)
    │
    ├── [Manage Syllabuses] ← NEW
    │   └── /admin/dashboard/syllabuses
    │       └── Syllabuses Dashboard Table
    │           ├── Columns:
    │           │   - File Name
    │           │   - University
    │           │   - Course ← NEW
    │           │   - Branch
    │           │   - Semester
    │           │   - Size
    │           │   - Date
    │           │   - Actions
    │           │
    │           ├── [Download] → Google Drive
    │           ├── [Edit] ← NEW
    │           │   └── /admin/dashboard/edit-syllabus/[id]
    │           │       └── EditSyllabusForm
    │           │           └── Update metadata
    │           │
    │           └── [Delete] → Confirmation → Delete
    │
    ├── [View Sales] → Sales page
    └── [Logout] → Login page
```

---

## 🎨 UI Layout - Admin Navbar

```
┌─────────────────────────────────────────────────────────────────────┐
│ 📚 Admin Panel  │ Dashboard  │ Upload Notes  │ Upload Syllabus  │   │
│                 │            │               │ Manage Syllabuses│   │
│                 │            │               │ View Sales       │   │
│                                                              admin@│ 🚪
└─────────────────────────────────────────────────────────────────────┘
                    (Sticky at top, z-index: 200)
```

---

## 📊 Upload Syllabus Form Layout

```
┌─────────────────────────────────────┐
│ Upload Syllabus                     │
│ Share your syllabus with students   │
├─────────────────────────────────────┤
│                                     │
│ University: [DTU         ▼]         │
│ Course:     [B.Tech      ▼]         │ ← Course field NEW
│ Branch:     [CSE         ▼]         │
│ Semester:   [Sem 5       ▼]         │
│                                     │
│ Syllabus PDF File:                  │
│ ┌──────────────────────────────────┐│
│ │       📤 Upload PDF              ││
│ │   Click to select or drag PDF    ││
│ │   Maximum size: 50MB             ││
│ └──────────────────────────────────┘│
│                                     │
│         [Upload Syllabus]           │
│                                     │
└─────────────────────────────────────┘
```

---

## 📋 Syllabuses Dashboard Table

```
┌─────────────────────────────────────────────────────────────────────────┐
│ File Name│University│Course  │Branch│Semester│Size   │Date │ Actions   │
├─────────────────────────────────────────────────────────────────────────┤
│ syllabus │   DTU    │ B.Tech │ CSE  │ Sem 5  │2.5 MB │Jan 20│ ⬇ 📝 🗑   │
│ notes    │   VIT    │ B.Tech │ ECE  │ Sem 6  │1.8 MB │Jan 19│ ⬇ 📝 🗑   │
│ guide    │   IIT    │ M.Tech │ ME   │ Sem 3  │3.2 MB │Jan 18│ ⬇ 📝 🗑   │
└─────────────────────────────────────────────────────────────────────────┘
  ⬇ = Download
  📝 = Edit
  🗑 = Delete
```

---

## 📝 Edit Syllabus Form Layout

```
┌─────────────────────────────────────┐
│ ← Back  Edit Syllabus               │
│         Update syllabus details     │
├─────────────────────────────────────┤
│ Syllabus Information                │
│                                     │
│ University: [DTU          ▼]        │
│ Course:     [B.Tech       ▼]        │
│ Branch:     [CSE          ▼]        │
│ Semester:   [Sem 5        ▼]        │
│                                     │
│ Title:      [Syllabus title]        │
│ Author:     [Author name]           │
│                                     │
│ Description:                        │
│ ┌────────────────────────────────┐ │
│ │ Full course syllabus...         │ │
│ │                                 │ │
│ └────────────────────────────────┘ │
│                                     │
│  [Save Changes]  [Cancel]           │
│                                     │
└─────────────────────────────────────┘
```

---

## 🗄️ Database Schema (Simplified)

```
syllabuses TABLE
├── id (UUID)
├── university (string) ✓
├── course (string) ← NEW
├── branch (string) ✓
├── semester (string) ✓
├── title (string) [optional]
├── description (text) [optional]
├── author (string) [optional]
├── google_drive_file_id (string)
├── download_url (string)
├── file_size_mb (decimal)
├── is_free (boolean)
├── download_count (integer)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## 🔌 API Endpoints Summary

```
API ROUTES:
├── POST   /api/upload-syllabus
│   └── Upload new syllabus with file
│
├── GET    /api/syllabuses
│   └── Fetch all syllabuses
│       └── Optional: ?university=X&branch=Y&semester=Z
│
├── GET    /api/syllabuses/[id]
│   └── Fetch single syllabus
│
├── PUT    /api/syllabuses/[id]
│   └── Update syllabus metadata
│
└── DELETE /api/syllabuses/[id]
    └── Delete syllabus
```

---

## 🎨 Color Scheme

```
Primary Color (Navbar):    #1E3A5F (Dark Blue)
├── Used in: Header, Navigation, primary buttons
│
Secondary Color (Action):  #F4A261 (Orange)
├── Used in: Upload button, Edit button, highlights
│
Tertiary Color (Success):  #2A9D8F (Teal)
├── Used in: Download button, Success messages
│
Error Color:              #E63946 (Red)
└── Used in: Delete button, Error messages
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 640px):
├── Single column layout
├── Hamburger menu for navbar
├── Full-width buttons
└── Stacked table on small screens

Tablet (640px - 1024px):
├── Two column forms
├── Compact navbar
└── Horizontal table scroll

Desktop (> 1024px):
├── Multi-column forms
├── Full navbar with labels
└── Full table display
```

---

## 🚀 Performance Features

```
Database:
├── Indexes on frequently queried fields
│   ├── university_idx
│   ├── course_idx
│   ├── branch_idx
│   ├── semester_idx
│   ├── created_at_idx
│   └── is_free_idx
│
Frontend:
├── CSS Modules for scoping
├── localStorage for form history
├── Lazy loading of components
└── Efficient re-renders
```

---

## 🔐 Security Features

```
Database Level:
├── Row Level Security (RLS)
├── Public access policy for free syllabuses
└── Admin-only modify policies

API Level:
├── Authorization header check
├── Admin email verification
└── Input validation

Frontend Level:
├── CSRF protection via Next.js
├── XSS protection via Next.js
├── File type validation
└── Error boundary handling
```

---

## 📚 File Organization

```
src/
├── components/
│   ├── AdminNavbar.tsx (NEW)
│   ├── AdminNavbar.module.css (NEW)
│   ├── UploadSyllabusForm.tsx (UPDATED)
│   └── UploadSyllabusForm.module.css (UPDATED)
│
├── app/
│   ├── admin/dashboard/
│   │   ├── page.tsx (UPDATED - uses AdminNavbar)
│   │   ├── upload-syllabus/ (NEW)
│   │   │   ├── page.tsx
│   │   │   └── upload-syllabus.module.css
│   │   ├── syllabuses/ (NEW)
│   │   │   ├── page.tsx
│   │   │   └── syllabuses.module.css
│   │   └── edit-syllabus/[id]/ (NEW)
│   │       ├── page.tsx
│   │       └── edit-syllabus.module.css
│   │
│   └── api/syllabuses/
│       ├── route.ts (UPDATED)
│       └── [id]/route.ts (NEW)
│
└── utils/
    └── google-drive-syllabus.ts (existing)
```

---

## ✅ Implementation Checklist

```
Database Setup:
  [✓] Create syllabuses table
  [✓] Add indexes
  [✓] Set up RLS policies
  [✓] Add course field

Frontend Components:
  [✓] Create AdminNavbar
  [✓] Update UploadSyllabusForm with course field
  [✓] Create Syllabuses Dashboard
  [✓] Create Edit Syllabus Page
  [✓] Create Upload Syllabus Page

API Endpoints:
  [✓] POST /api/upload-syllabus
  [✓] GET /api/syllabuses
  [✓] GET /api/syllabuses/[id]
  [✓] PUT /api/syllabuses/[id]
  [✓] DELETE /api/syllabuses/[id]

Styling:
  [✓] AdminNavbar styles
  [✓] Upload form styles
  [✓] Dashboard styles
  [✓] Edit form styles
  [✓] Mobile responsive

Documentation:
  [✓] Database migration SQL
  [✓] API documentation
  [✓] Component guide
  [✓] Implementation guide
  [✓] Visual flow guide
```

---

**Last Updated**: January 20, 2026
**Status**: ✅ Complete & Ready for Production
