# Syllabus Management System - Complete Guide

## 📋 Overview

The Syllabus Management System is a **FREE** resource platform where admins can upload university syllabuses and students can download them. Syllabuses are stored in Google Drive with a structured folder hierarchy and metadata is stored in Supabase.

**Folder Structure in Google Drive:**
```
syllabuses/
├── IIT Delhi/
│   ├── Computer Science/
│   │   ├── Sem 1/
│   │   ├── Sem 2/
│   │   └── ...
│   └── Electronics/
└── Delhi University/
```

---

## 🗄️ Database Setup

### SQL Migration File
File: `DATABASE_MIGRATION_SYLLABUS.sql`

Run this SQL to create the syllabuses table:

```sql
-- Create syllabuses table
CREATE TABLE IF NOT EXISTS syllabuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university VARCHAR(255) NOT NULL,
  course VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  author VARCHAR(255) NOT NULL,
  google_drive_file_id VARCHAR(500) NOT NULL,
  download_url TEXT NOT NULL,
  file_size_mb DECIMAL(10, 2),
  is_free BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Fields:**
- `id`: Unique identifier
- `university`: University name (e.g., "IIT Delhi")
- `branch`: Branch/Stream (e.g., "Computer Science")
- `semester`: Semester (e.g., "Sem 1", "Sem 2")
- `google_drive_file_id`: Used to manage files on Google Drive
- `download_url`: Direct download link from Google Drive
- `is_free`: Always TRUE for syllabuses (no payment)
- `download_count`: Tracks popularity

---

## 🔧 Components Created

### 1. **SyllabusUploadForm.tsx** & **SyllabusUploadForm.module.css**
**Location:** `src/components/`

Admin component for uploading syllabuses.

**Features:**
- Form fields: University, Course, Branch, Semester, Title, Description, Author
- PDF file upload with drag-and-drop
- Saves form options to localStorage for quick re-entry
- Success message on upload
- Automatic folder creation in Google Drive

**Usage:**
```tsx
import SyllabusUploadForm from '@/components/SyllabusUploadForm';

export default function Page() {
  return (
    <SyllabusUploadForm 
      onSuccess={() => {
        // Refresh or navigate after upload
      }} 
    />
  );
}
```

---

### 2. **SyllabusDashboard.tsx** & **SyllabusDashboard.module.css**
**Location:** `src/components/`

Admin dashboard for managing uploaded syllabuses.

**Features:**
- Search syllabuses by title, description, author
- Filter by university and branch
- View download count and file size
- Delete syllabuses (removes from both Drive and Database)
- Download syllabuses
- Card-based UI with statistics

**Usage:**
```tsx
import SyllabusDashboard from '@/components/SyllabusDashboard';

export default function AdminPage() {
  return <SyllabusDashboard />;
}
```

---

### 3. **Student Browse Page**
**Location:** `src/app/student/syllabuses/page.tsx` & `syllabuses.module.css`

Public page where students can browse and download free syllabuses.

**Features:**
- Search syllabuses
- Filter by University, Branch, Semester
- View all relevant metadata
- One-click download with download count tracking
- Responsive grid layout
- Beautiful gradient header and cards

**URL:** `/student/syllabuses`

---

## 📡 API Routes

### 1. **POST /api/upload-syllabus**
Upload a new syllabus.

**Request:**
```typescript
Method: POST
Content-Type: multipart/form-data

Body:
- file: File (PDF)
- university: string
- course: string
- branch: string
- semester: string
- title: string
- description: string
- author: string

Headers:
- Authorization: Bearer <admin-email>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "...",
    "download_url": "https://drive.google.com/uc?export=download&id=...",
    "file_size_mb": 2.5,
    "download_count": 0
  },
  "message": "Syllabus uploaded successfully"
}
```

---

### 2. **GET /api/syllabuses**
Fetch syllabuses with optional filters.

**Request:**
```
GET /api/syllabuses?university=IIT%20Delhi&branch=Computer%20Science&semester=Sem%201
```

**Query Parameters:**
- `university` (optional): Filter by university
- `branch` (optional): Filter by branch
- `semester` (optional): Filter by semester

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "university": "IIT Delhi",
      "branch": "Computer Science",
      "semester": "Sem 1",
      "title": "Data Structures Syllabus",
      "description": "...",
      "author": "Department",
      "download_url": "...",
      "file_size_mb": 2.5,
      "download_count": 45,
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 3. **DELETE /api/syllabuses?id=<UUID>**
Delete a syllabus (admin only).

**Request:**
```
DELETE /api/syllabuses?id=abc123...
Headers:
- Authorization: Bearer <admin-email>
```

**Response:**
```json
{
  "success": true,
  "message": "Syllabus deleted successfully"
}
```

**Note:** Deletes from both Google Drive and Supabase database.

---

### 4. **PUT /api/syllabuses?id=<UUID>&action=increment-downloads**
Increment download count (called automatically on download).

**Request:**
```
PUT /api/syllabuses?id=abc123...&action=increment-downloads
```

**Response:**
```json
{
  "success": true,
  "message": "Download count updated"
}
```

---

## 🚀 Google Drive Setup

### Utility File
**Location:** `src/utils/google-drive-syllabus.ts`

**Functions:**
1. `getOrCreateSyllabusFolder()` - Creates nested folder structure
2. `uploadSyllabusToDrive()` - Uploads PDF to Drive
3. `deleteFromDrive()` - Deletes file from Drive

**Folder Structure Created:**
```
syllabuses/
└── [University]/
    └── [Branch]/
        └── [Semester]/
            └── [PDF files]
```

**Environment Variables Required:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_DRIVE_FOLDER_ID` (Parent folder ID)

---

## 📱 Integration Steps

### Step 1: Create Database Table
Run the migration SQL in Supabase:
```sql
-- From DATABASE_MIGRATION_SYLLABUS.sql
```

### Step 2: Add Upload Page to Admin Dashboard
Update `src/app/admin/dashboard/upload/page.tsx`:
```tsx
import SyllabusUploadForm from '@/components/SyllabusUploadForm';

export default function UploadPage() {
  return (
    <div>
      <h1>Upload Notes & Syllabuses</h1>
      
      {/* Existing Notes Upload */}
      <UploadNotesForm />
      
      {/* New Syllabus Upload */}
      <SyllabusUploadForm />
    </div>
  );
}
```

### Step 3: Add Dashboard Page to Admin
Create/Update `src/app/admin/dashboard/syllabuses/page.tsx`:
```tsx
import SyllabusDashboard from '@/components/SyllabusDashboard';

export default function SyllabusDashboardPage() {
  return <SyllabusDashboard />;
}
```

### Step 4: Add Link in Navigation
Update your navigation to include:
- `/admin/dashboard/upload` - Upload syllabuses
- `/admin/dashboard/syllabuses` - Manage syllabuses
- `/student/syllabuses` - Browse free syllabuses

---

## 📊 Analytics & Useful Queries

### Get All Syllabuses for a University
```sql
SELECT * FROM syllabuses 
WHERE university = 'IIT Delhi' 
ORDER BY created_at DESC;
```

### Get Top Downloaded Syllabuses
```sql
SELECT title, author, download_count, created_at 
FROM syllabuses 
WHERE is_free = TRUE
ORDER BY download_count DESC 
LIMIT 10;
```

### Get Statistics by University
```sql
SELECT 
  university, 
  COUNT(*) as total_syllabuses,
  SUM(download_count) as total_downloads,
  ROUND(AVG(download_count), 2) as avg_downloads_per_syllabus
FROM syllabuses
GROUP BY university
ORDER BY total_downloads DESC;
```

### Get Recent Uploads
```sql
SELECT title, university, branch, semester, created_at 
FROM syllabuses 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## 🎨 Styling

All components use CSS modules with variables from `globals.css`:
- Primary Color: `#1E3A5F` (Blue)
- Secondary Color: `#F4A261` (Orange)
- Tertiary Color: `#2A9D8F` (Teal/Green)
- Success Color: `#2A9D8F`

---

## 🔒 Security

1. **Authorization:** All admin operations require `Authorization` header
2. **File Validation:** Only PDF files are accepted
3. **Drive Management:** Files are stored in specific folder structure
4. **Database:** Supabase handles row-level security

---

## 📝 Features Summary

| Feature | Admin | Student |
|---------|-------|---------|
| Upload Syllabus | ✅ | ❌ |
| View Syllabuses | ✅ | ✅ |
| Download Syllabus | ✅ | ✅ |
| Delete Syllabus | ✅ | ❌ |
| Search | ✅ | ✅ |
| Filter | ✅ | ✅ |
| Download Count | ✅ | ✅ |
| Free Access | ✅ | ✅ |

---

## 🆘 Troubleshooting

### Upload Fails
- Check Google Drive credentials
- Verify `GOOGLE_DRIVE_FOLDER_ID` exists
- Ensure PDF file is valid
- Check file size (max 50MB)

### Folder Structure Not Created
- Check Google Drive API permissions
- Verify refresh token is valid
- Check parent folder ID permissions

### Download Count Not Updating
- Soft failure - download still works
- Check Supabase connection
- Review API logs for errors

---

## 📦 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload-syllabus/
│   │   │   └── route.ts
│   │   └── syllabuses/
│   │       └── route.ts
│   └── student/
│       └── syllabuses/
│           ├── page.tsx
│           └── syllabuses.module.css
├── components/
│   ├── SyllabusUploadForm.tsx
│   ├── SyllabusUploadForm.module.css
│   ├── SyllabusDashboard.tsx
│   └── SyllabusDashboard.module.css
└── utils/
    └── google-drive-syllabus.ts
```

---

## 🎯 Next Steps

1. Run the database migration SQL
2. Add components to admin dashboard
3. Create admin menu items for syllabus management
4. Test upload and download functionality
5. Promote `/student/syllabuses` in your platform

