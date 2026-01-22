# Syllabus Management System - Implementation Guide

## Overview
Complete syllabus management system for the admin dashboard with upload, edit, and delete functionality.

---

## Database Setup

### SQL Migration: Create Syllabuses Table

```sql
-- Create syllabuses table with all required fields
CREATE TABLE IF NOT EXISTS public.syllabuses (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- File Information
  university VARCHAR(255) NOT NULL,
  course VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  
  -- Optional Metadata
  title VARCHAR(500),
  description TEXT,
  author VARCHAR(255),
  
  -- Google Drive Integration
  google_drive_file_id VARCHAR(500) NOT NULL,
  download_url TEXT NOT NULL,
  web_view_link TEXT,
  
  -- File Details
  file_size_mb DECIMAL(10, 2) DEFAULT 0,
  file_name VARCHAR(500),
  
  -- Status & Access Control
  is_free BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX syllabuses_university_idx ON public.syllabuses(university);
CREATE INDEX syllabuses_course_idx ON public.syllabuses(course);
CREATE INDEX syllabuses_branch_idx ON public.syllabuses(branch);
CREATE INDEX syllabuses_semester_idx ON public.syllabuses(semester);
CREATE INDEX syllabuses_created_at_idx ON public.syllabuses(created_at);
CREATE INDEX syllabuses_is_free_idx ON public.syllabuses(is_free);

-- Enable Row Level Security
ALTER TABLE public.syllabuses ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to free syllabuses
CREATE POLICY "Allow public read access to free syllabuses"
  ON public.syllabuses
  FOR SELECT
  USING (is_free = TRUE);
```

---

## API Endpoints

### 1. **POST /api/upload-syllabus**
Upload a new syllabus to Google Drive and save metadata to database.

**Request:**
```javascript
FormData:
- university (string, required)
- course (string, required)
- branch (string, required)
- semester (string, required)
- file (File, PDF, required)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "university": "DTU",
    "course": "B.Tech",
    "branch": "CSE",
    "semester": "Sem 5",
    "download_url": "https://drive.google.com/uc?export=download&id=...",
    "file_size_mb": 2.5,
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```

### 2. **GET /api/syllabuses**
Fetch all syllabuses with optional filtering.

**Query Parameters:**
```
?university=DTU&branch=CSE&semester=Sem%205
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "university": "DTU",
      "course": "B.Tech",
      "branch": "CSE",
      "semester": "Sem 5",
      "title": "Complete Syllabus",
      "author": "Admin",
      "download_url": "...",
      "file_size_mb": 2.5,
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "count": 1
}
```

### 3. **GET /api/syllabuses/[id]**
Fetch a single syllabus by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "university": "DTU",
    "course": "B.Tech",
    "branch": "CSE",
    "semester": "Sem 5",
    "title": "Complete Syllabus",
    "description": "Full course syllabus...",
    "author": "Admin",
    "download_url": "...",
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```

### 4. **PUT /api/syllabuses/[id]**
Update syllabus metadata (university, course, branch, semester, title, description, author).

**Request:**
```json
{
  "university": "DTU",
  "course": "B.Tech",
  "branch": "CSE",
  "semester": "Sem 5",
  "title": "Updated Title",
  "description": "Updated description",
  "author": "Updated Author"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated syllabus */ },
  "message": "Syllabus updated successfully"
}
```

### 5. **DELETE /api/syllabuses/[id]**
Delete a syllabus (removes from Google Drive and database).

**Response:**
```json
{
  "success": true,
  "message": "Syllabus deleted successfully"
}
```

---

## File Structure

```
src/
├── app/
│   └── admin/
│       └── dashboard/
│           ├── syllabuses/           (Syllabus Dashboard)
│           │   ├── page.tsx
│           │   └── syllabuses.module.css
│           ├── upload-syllabus/      (Upload Form Page)
│           │   ├── page.tsx
│           │   └── upload-syllabus.module.css
│           └── edit-syllabus/[id]/   (Edit Form Page)
│               ├── page.tsx
│               └── edit-syllabus.module.css
├── api/
│   └── syllabuses/
│       ├── route.ts                  (GET, DELETE)
│       └── [id]/route.ts             (GET, PUT, DELETE by ID)
├── components/
│   ├── UploadSyllabusForm.tsx
│   ├── UploadSyllabusForm.module.css
│   ├── AdminNavbar.tsx
│   └── AdminNavbar.module.css
└── utils/
    └── google-drive-syllabus.ts      (Google Drive Integration)
```

---

## Features Implemented

### ✅ **Upload Syllabus**
- Upload PDF files to Google Drive
- Nested folder structure: `syllabuses/{university}/{branch}/{semester}`
- Fields: University, Course, Branch, Semester
- Auto-save form options to localStorage

### ✅ **Syllabuses Dashboard**
- View all uploaded syllabuses in a table
- Filter by university, course, branch, semester
- Display: File Name, University, Course, Branch, Semester, File Size, Date
- Download, Edit, and Delete buttons

### ✅ **Edit Syllabus**
- Update syllabus metadata
- Fields: University, Course, Branch, Semester, Title, Description, Author
- Save changes and redirect to dashboard

### ✅ **Delete Syllabus**
- Remove from Google Drive
- Remove from database
- Confirmation dialog

### ✅ **Admin Navbar**
- Modern sticky navbar with navigation
- Links: Dashboard, Upload Notes, Upload Syllabus, Manage Syllabuses, Sales
- User email display
- Logout button
- Mobile-responsive menu

### ✅ **Colors Used**
- **Primary**: `#1E3A5F` (Dark Blue)
- **Secondary**: `#F4A261` (Orange)
- **Tertiary**: `#2A9D8F` (Teal)
- All from `global.css`

---

## Component Breakdown

### AdminNavbar.tsx
Professional sticky navigation with:
- Brand logo/text
- Navigation menu with icons
- Active state indicators
- User section with email and logout
- Mobile hamburger menu
- Smooth animations

### UploadSyllabusForm.tsx
Form with:
- University (text input with datalist)
- Course (text input with datalist)
- Branch (text input with datalist)
- Semester (select dropdown)
- PDF file upload
- Success/error messages
- localStorage for form history

### Syllabuses Dashboard
Table display with:
- 8 columns including new "Course" field
- Badge-based styling for fields
- Download, Edit, Delete actions
- Empty state with upload prompt
- Loading state
- Responsive table

### Edit Syllabus Page
Form to update:
- University, Course, Branch, Semester (required)
- Title, Description, Author (optional)
- Success/error messages
- Save and Cancel buttons

---

## Integration Steps

1. **Run Database Migration** - Execute the SQL queries above in Supabase
2. **Verify API Endpoints** - Check `/api/syllabuses` and `/api/syllabuses/[id]`
3. **Test Upload** - Go to `/admin/dashboard/upload-syllabus`
4. **View Dashboard** - Check `/admin/dashboard/syllabuses`
5. **Test Edit/Delete** - Use action buttons in dashboard

---

## Styling Notes

- Uses CSS modules for component scoping
- Responsive design for mobile, tablet, desktop
- Color scheme from global.css
- Smooth transitions and hover effects
- Accessibility considerations

---

## Environment Variables Required

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing Checklist

- [ ] Upload syllabus with all fields
- [ ] Verify it appears on dashboard
- [ ] Edit syllabus metadata
- [ ] Download syllabus
- [ ] Delete syllabus (verify Google Drive deletion)
- [ ] Test navbar navigation
- [ ] Test responsive design on mobile
- [ ] Test form validation
- [ ] Test localStorage dropdown persistence

---

## Troubleshooting

**Syllabuses not appearing on dashboard:**
- Check API endpoint `/api/syllabuses` returns data
- Verify Supabase table exists and has data
- Check browser console for errors
- Ensure admin is logged in

**Upload fails:**
- Check Google Drive credentials
- Verify file is PDF
- Check file size < 50MB
- Check environment variables

**Edit doesn't save:**
- Verify authorization header
- Check Supabase permissions
- Check API endpoint is returning correct response

---

## Future Enhancements

- [ ] Bulk upload syllabuses
- [ ] Syllabus preview in modal
- [ ] Filter and search improvements
- [ ] Drag-and-drop file upload
- [ ] Syllabus versioning
- [ ] Access control per user
- [ ] Search across all syllabuses on student side

