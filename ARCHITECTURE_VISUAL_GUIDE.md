# 🏗️ Syllabus System - Architecture & Visual Guide

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOTES MARKETPLACE PLATFORM                   │
│                                                                  │
│  ┌──────────────────────────┐    ┌──────────────────────────┐  │
│  │    ADMIN DASHBOARD       │    │   STUDENT PLATFORM       │  │
│  │                          │    │                          │  │
│  │  1. Upload Syllabuses    │    │  1. Browse Syllabuses    │  │
│  │  2. Manage Syllabuses    │    │  2. Download FREE        │  │
│  │  3. View Analytics       │    │  3. Search & Filter      │  │
│  │  4. Delete Old Files     │    │  4. View Download Count  │  │
│  └──────────────────────────┘    └──────────────────────────┘  │
│           │                                    │                 │
│           └────────────────┬────────────────────┘                │
│                            │                                    │
│                   ┌────────▼────────┐                          │
│                   │   API ROUTES    │                          │
│                   │                 │                          │
│                   │ • upload        │                          │
│                   │ • fetch         │                          │
│                   │ • delete        │                          │
│                   │ • increment     │                          │
│                   └────────┬────────┘                          │
│                            │                                    │
│        ┌───────────────────┼───────────────────┐               │
│        │                   │                   │               │
│   ┌────▼────┐    ┌────────▼────────┐    ┌────▼─────┐         │
│   │ Supabase│    │  Google Drive   │    │Utilities │         │
│   │         │    │                 │    │          │         │
│   │syllabuses│  │syllabuses/      │   │Drive API │         │
│   │  table  │    │  university/    │    │Folder    │         │
│   │         │    │    branch/      │    │Management│         │
│   │         │    │    semester/    │    │          │         │
│   └─────────┘    │      files      │    └──────────┘         │
│                   └────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Google Drive Folder Structure

```
Your Main Drive Folder (GOOGLE_DRIVE_FOLDER_ID)
│
├── 📁 General (Existing - for notes)
│   ├── 📄 Note1.pdf
│   ├── 📄 Note2.pdf
│   └── 📄 Note3.pdf
│
└── 📁 syllabuses (NEW - for free syllabuses)
    │
    ├── 📁 IIT Delhi
    │   ├── 📁 Computer Science
    │   │   ├── 📁 Sem 1
    │   │   │   ├── 📄 CS101_Syllabus.pdf
    │   │   │   ├── 📄 CS102_Syllabus.pdf
    │   │   │   └── 📄 CS103_Syllabus.pdf
    │   │   │
    │   │   ├── 📁 Sem 2
    │   │   │   ├── 📄 CS201_Syllabus.pdf
    │   │   │   └── 📄 CS202_Syllabus.pdf
    │   │   │
    │   │   └── 📁 Sem 3
    │   │       └── 📄 CS301_Syllabus.pdf
    │   │
    │   └── 📁 Electronics
    │       ├── 📁 Sem 1
    │       │   └── 📄 EC101_Syllabus.pdf
    │       │
    │       └── 📁 Sem 2
    │           └── 📄 EC201_Syllabus.pdf
    │
    ├── 📁 Delhi University
    │   ├── 📁 Computer Science
    │   │   ├── 📁 Sem 1
    │   │   └── 📁 Sem 2
    │   │
    │   └── 📁 Physics
    │       ├── 📁 Sem 1
    │       └── 📁 Sem 2
    │
    └── 📁 [More Universities...]
```

---

## 🗄️ Database Schema Visualization

```
┌─────────────────────────────────────────────────────────┐
│                    SYLLABUSES TABLE                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  id (UUID, PRIMARY KEY)                                │
│  ├─ 550e8400-e29b-41d4-a716-446655440000             │
│  │                                                      │
│  university (VARCHAR 255)                              │
│  ├─ "IIT Delhi"                                       │
│  │                                                      │
│  course (VARCHAR 255)                                  │
│  ├─ "B.Tech CSE"                                      │
│  │                                                      │
│  branch (VARCHAR 255)                                  │
│  ├─ "Computer Science"                                │
│  │                                                      │
│  semester (VARCHAR 50)                                 │
│  ├─ "Sem 1"                                           │
│  │                                                      │
│  title (VARCHAR 500)                                   │
│  ├─ "Data Structures & Algorithms Syllabus"           │
│  │                                                      │
│  description (TEXT)                                    │
│  ├─ "Complete DSA syllabus covering arrays, linked... │
│  │                                                      │
│  author (VARCHAR 255)                                  │
│  ├─ "Computer Science Department"                     │
│  │                                                      │
│  google_drive_file_id (VARCHAR 500)                    │
│  ├─ "1a2b3c4d5e6f7g8h9i0j"                           │
│  │                                                      │
│  download_url (TEXT)                                   │
│  ├─ "https://drive.google.com/uc?export=download&... │
│  │                                                      │
│  file_size_mb (DECIMAL 10,2)                           │
│  ├─ 2.45                                              │
│  │                                                      │
│  is_free (BOOLEAN, DEFAULT TRUE)                       │
│  ├─ true                                              │
│  │                                                      │
│  download_count (INTEGER, DEFAULT 0)                   │
│  ├─ 45                                                │
│  │                                                      │
│  created_at (TIMESTAMP)                                │
│  ├─ 2024-01-20 10:30:00                              │
│  │                                                      │
│  updated_at (TIMESTAMP)                                │
│  └─ 2024-01-22 15:45:00                              │
│                                                         │
└─────────────────────────────────────────────────────────┘

INDEXES (for fast queries):
├─ idx_syllabuses_university
├─ idx_syllabuses_branch
├─ idx_syllabuses_semester
├─ idx_syllabuses_course
├─ idx_syllabuses_free
├─ idx_syllabuses_university_branch_semester
└─ idx_syllabuses_created_at
```

---

## 🔄 Data Flow Diagram

### Upload Flow
```
┌─────────────────┐
│  Admin User     │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│  Fill Upload Form            │
│  • University                │
│  • Branch                    │
│  • Semester                  │
│  • Title & Description       │
│  • Author & PDF File         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Submit to /api/upload-       │
│  syllabus (POST)             │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Validate                    │
│  • Check auth header         │
│  • Check file type (PDF)     │
│  • Check file size (<50MB)   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Create Nested Folder        │
│  Structure in Drive:         │
│  syllabuses/University/      │
│  Branch/Semester/            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Upload File to Drive        │
│  → Get file_id & download_url│
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Save to Supabase            │
│  (syllabuses table)          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Return Success Response     │
│  • Syllabus ID              │
│  • Download URL             │
│  • File Size                │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Admin Sees Success Message  │
│  (Auto-close after 3 sec)    │
└──────────────────────────────┘
```

### Download Flow
```
┌──────────────────┐
│  Student User    │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────┐
│  Visit /student/syllabuses  │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Load Syllabuses from API  │
│  GET /api/syllabuses       │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Display Grid:             │
│  • Cards with metadata     │
│  • Search bar              │
│  • Filter dropdowns        │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Student Searches/Filters  │
│  (Real-time filtering)     │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Clicks Download Button    │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Call API to Increment     │
│  PUT /api/syllabuses       │
│  ?action=increment-downloads
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Database updates          │
│  download_count += 1       │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Open Download URL in new  │
│  tab (Google Drive)        │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Browser downloads PDF     │
│  from Google Drive         │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Success! Student has PDF  │
└────────────────────────────┘
```

---

## 🎯 Component Hierarchy

```
App
│
├── Admin Dashboard
│   │
│   ├── /admin/dashboard/upload
│   │   ├── UploadNotesForm (existing)
│   │   └── SyllabusUploadForm (NEW)
│   │       ├── Form Fields
│   │       ├── File Upload
│   │       └── Success Message
│   │
│   └── /admin/dashboard/syllabuses (NEW)
│       └── SyllabusDashboard
│           ├── SearchBar
│           ├── Filters
│           ├── SyllabusCard (array)
│           │   ├── Metadata
│           │   ├── Description
│           │   ├── Statistics
│           │   └── Actions (Download, Delete)
│           └── Empty State
│
└── Student Platform
    │
    └── /student/syllabuses (NEW)
        ├── Header
        ├── SearchBar
        ├── Filters
        ├── ResultsInfo
        ├── SyllabusCard (array)
        │   ├── CardHeader
        │   ├── Metadata
        │   ├── Description
        │   ├── Statistics
        │   └── Download Button
        └── EmptyState
```

---

## 📡 API Routes Map

```
┌───────────────────────────────────────────┐
│           API ROUTES STRUCTURE            │
├───────────────────────────────────────────┤
│                                           │
│  POST /api/upload-syllabus                │
│  ├─ Auth: Required (Bearer token)         │
│  ├─ Input: FormData (file + metadata)     │
│  ├─ Process: Upload to Drive + DB         │
│  └─ Output: 201 (success or warning)      │
│                                           │
│  GET /api/syllabuses                      │
│  ├─ Auth: Not required (public)           │
│  ├─ Input: Query params (filters)         │
│  │  ├─ ?university=...                    │
│  │  ├─ ?branch=...                        │
│  │  └─ ?semester=...                      │
│  ├─ Process: Query from Supabase          │
│  └─ Output: 200 (array of syllabuses)     │
│                                           │
│  DELETE /api/syllabuses                   │
│  ├─ Auth: Required (Bearer token)         │
│  ├─ Input: ?id=UUID                       │
│  ├─ Process: Delete from Drive + DB       │
│  └─ Output: 200 (success) or 404 (error)  │
│                                           │
│  PUT /api/syllabuses                      │
│  ├─ Auth: Not required                    │
│  ├─ Input: ?id=UUID&action=increment-...  │
│  ├─ Process: Update download_count        │
│  └─ Output: 200 (success)                 │
│                                           │
└───────────────────────────────────────────┘
```

---

## 🔐 Authorization & Security Flow

```
┌─────────────────────────────────────────────────┐
│           AUTHORIZATION CHECKS                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Admin Operations (Upload, Delete)              │
│  ┌───────────────────────────────────────────┐ │
│  │ 1. Check Authorization Header              │ │
│  │    Authorization: Bearer <admin-email>    │ │
│  │                                            │ │
│  │ 2. Validate Admin Status                   │ │
│  │    (from token)                            │ │
│  │                                            │ │
│  │ 3. Check Environment Variables             │ │
│  │    • GOOGLE_CLIENT_ID                      │ │
│  │    • GOOGLE_CLIENT_SECRET                  │ │
│  │    • GOOGLE_REFRESH_TOKEN                  │ │
│  │    • GOOGLE_DRIVE_FOLDER_ID                │ │
│  │                                            │ │
│  │ 4. Proceed with Operation                  │ │
│  │    OR return 401 Unauthorized              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Public Operations (View, Download)             │
│  ┌───────────────────────────────────────────┐ │
│  │ 1. No Authorization Required               │ │
│  │                                            │ │
│  │ 2. Query Supabase (is_free = true only)   │ │
│  │                                            │ │
│  │ 3. Return Public Data                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 UI Component Structure

### Upload Form
```
┌─────────────────────────────────────────┐
│         SyllabusUploadForm              │
├─────────────────────────────────────────┤
│                                         │
│  Header: "Upload Syllabus (Free)"      │
│                                         │
│  ┌─ Form Grid (2 columns)              │
│  │  ├─ University Datalist             │
│  │  ├─ Course Datalist                 │
│  │  ├─ Branch Datalist                 │
│  │  ├─ Semester Select                 │
│  │  ├─ Title Input                     │
│  │  ├─ Description Textarea            │
│  │  ├─ Author Input                    │
│  │  └─ File Upload (drag & drop)       │
│  │                                      │
│  ├─ Submit Button (Upload Syllabus)    │
│  │                                      │
│  └─ Footer: "Max 50MB, PDF only, FREE" │
│                                         │
│  [Success Message - slides in]         │
│  ✓ Syllabus uploaded successfully!     │
│                                         │
└─────────────────────────────────────────┘
```

### Dashboard
```
┌────────────────────────────────────────────┐
│        SyllabusDashboard                   │
├────────────────────────────────────────────┤
│                                            │
│  Header: "Syllabus Management"            │
│                                            │
│  ┌─ Filters Section                      │
│  │  ├─ Search Bar (title, description)   │
│  │  ├─ University Filter                 │
│  │  └─ Branch Filter                     │
│  │                                        │
│  ├─ Results Info: "Showing X of Y"       │
│  │                                        │
│  ├─ Syllabuses Grid                      │
│  │  └─ SyllabusCard (repeating)          │
│  │     ├─ Title + FREE Tag               │
│  │     ├─ Metadata (university, branch)  │
│  │     ├─ Description                    │
│  │     ├─ Stats (size, downloads)        │
│  │     ├─ Date Created                   │
│  │     └─ Actions (Download, Delete)     │
│  │                                        │
│  └─ Empty State (if no results)          │
│                                            │
└────────────────────────────────────────────┘
```

### Student Browse Page
```
┌──────────────────────────────────────────────┐
│      /student/syllabuses Page                │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─ Header (Gradient Background)            │
│  │  Title: "Free Syllabuses"                │
│  │  Subtitle: "Download from your uni..."  │
│  │                                           │
│  ├─ Filters Section                         │
│  │  ├─ Search Bar                           │
│  │  ├─ University Select                    │
│  │  ├─ Branch Select                        │
│  │  └─ Semester Select                      │
│  │                                           │
│  ├─ Results Count                           │
│  │  "Found X of Y syllabuses"              │
│  │                                           │
│  ├─ Responsive Grid                         │
│  │  └─ SyllabusCard (repeating)             │
│  │     ├─ Title + FREE Badge               │
│  │     ├─ Metadata Row (university)        │
│  │     ├─ Metadata Row (branch)            │
│  │     ├─ Metadata Row (semester)          │
│  │     ├─ Metadata Row (author)            │
│  │     ├─ Description (truncated)          │
│  │     ├─ Stats (size, downloads, added)   │
│  │     └─ Download Button (gradient)       │
│  │                                           │
│  └─ Empty State (if no results)             │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🎨 Color & Style System

```
Primary Colors (from globals.css):
├─ --primary: #1E3A5F (Dark Blue)
├─ --secondary: #F4A261 (Orange)
├─ --tertiary: #2A9D8F (Teal Green)
├─ --success: #2A9D8F (Green)
└─ --error: #E63946 (Red)

Component Colors:
├─ Headers: Primary + Tertiary gradient
├─ Buttons: Primary -> Tertiary gradient
├─ Cards: White background + primary border on hover
├─ Tags: Success with transparency
├─ Text: Foreground (dark) + text-light (gray)
└─ Backgrounds: Neutral-50 (light gray)

Effects:
├─ Shadows: Box shadows for depth
├─ Transitions: 0.3s ease for all interactive elements
├─ Hover: Transform translateY(-2px) + shadow increase
├─ Focus: Blue ring (3px rgba)
└─ Animations: Spin (for loaders), SlideDown (for success)
```

---

## 📈 Performance Considerations

```
Database Optimization:
├─ Indexes on frequently filtered columns
│  ├─ university
│  ├─ branch
│  ├─ semester
│  └─ university+branch+semester
├─ Default ordering by created_at DESC
├─ Pagination-ready structure
└─ Small result sets per query

Frontend Optimization:
├─ Lazy loading with Suspense
├─ CSS modules (no global conflicts)
├─ Image optimization (icons from MUI)
├─ Responsive images (different screen sizes)
├─ Client-side filtering (instant results)
└─ Memoization ready for future

API Optimization:
├─ Query parameters for filtering
├─ Single API call per page load
├─ Download count increment is non-blocking
├─ Error handling doesn't break download
└─ Batch operations possible for future
```

---

## 🚀 Deployment Checklist

```
Pre-Deployment:
├─ [ ] Database migration run
├─ [ ] All files created in correct locations
├─ [ ] Environment variables configured
├─ [ ] Google Drive folder ID verified
├─ [ ] Supabase credentials verified
└─ [ ] Navigation links added

Testing:
├─ [ ] Upload form validation
├─ [ ] File upload to Drive
├─ [ ] Metadata storage in DB
├─ [ ] Admin dashboard displays correctly
├─ [ ] Student page displays correctly
├─ [ ] Download functionality works
├─ [ ] Delete functionality works
├─ [ ] Search and filters work
├─ [ ] Mobile responsive tested
└─ [ ] Error messages display correctly

Post-Deployment:
├─ [ ] Monitor error logs
├─ [ ] Check Google Drive folder structure
├─ [ ] Verify database table has data
├─ [ ] Test with real users
├─ [ ] Gather feedback
└─ [ ] Plan enhancements
```

---

This visual guide complements the technical documentation and helps visualize how all components work together! 🎉

