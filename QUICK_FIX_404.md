# 🚀 Quick Fix Guide - 404 Error in Edit Syllabus

## The Problem
Clicking Edit button shows 404 error because the database table doesn't exist.

## The Solution (Copy & Paste)

### Step 1: Open Supabase
Go to: https://supabase.com → Your Project → SQL Editor → New Query

### Step 2: Copy This SQL
```sql
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
  web_view_link TEXT,
  file_size_mb DECIMAL(10, 2),
  is_free BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_syllabuses_university ON syllabuses(university);
CREATE INDEX IF NOT EXISTS idx_syllabuses_branch ON syllabuses(branch);
CREATE INDEX IF NOT EXISTS idx_syllabuses_semester ON syllabuses(semester);
CREATE INDEX IF NOT EXISTS idx_syllabuses_course ON syllabuses(course);
CREATE INDEX IF NOT EXISTS idx_syllabuses_university_branch_semester ON syllabuses(university, branch, semester);
CREATE INDEX IF NOT EXISTS idx_syllabuses_created_at ON syllabuses(created_at DESC);
```

### Step 3: Run It
Click the **Run** button → Wait for success

### Step 4: Upload Syllabus
1. Go to: http://localhost:3000/admin/dashboard/upload-syllabus
2. Fill all fields
3. Upload a PDF

### Step 5: Test Edit
1. Go to: http://localhost:3000/admin/dashboard/syllabuses
2. Click **Edit** button
3. Form loads successfully (No 404!)
4. Edit and save

---

## That's It! ✅

**Time**: 5 minutes  
**Difficulty**: Easy  
**Result**: Everything works! 🎉
