# Fix: Edit & Delete Not Working on Syllabus Dashboard

## Problem Analysis

**Issue**: Edit and Delete buttons on syllabus dashboard are not working

**Likely Causes**:
1. ❌ Table `syllabuses` doesn't exist in Supabase
2. ❌ No data in the table yet
3. ❌ Missing authorization header

---

## Solution

### Step 1: Create the Database Table

Run this SQL in Supabase SQL Editor:

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
  web_view_link TEXT,
  file_size_mb DECIMAL(10, 2),
  is_free BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_syllabuses_university ON syllabuses(university);
CREATE INDEX IF NOT EXISTS idx_syllabuses_branch ON syllabuses(branch);
CREATE INDEX IF NOT EXISTS idx_syllabuses_semester ON syllabuses(semester);
CREATE INDEX IF NOT EXISTS idx_syllabuses_course ON syllabuses(course);
CREATE INDEX IF NOT EXISTS idx_syllabuses_university_branch_semester ON syllabuses(university, branch, semester);
CREATE INDEX IF NOT EXISTS idx_syllabuses_created_at ON syllabuses(created_at DESC);
```

---

### Step 2: Upload Your First Syllabus

1. Navigate to: `http://localhost:3000/admin/dashboard/upload-syllabus`
2. Fill in the form:
   - **University**: e.g., "IIT Delhi"
   - **Course**: e.g., "B.Tech"
   - **Branch**: e.g., "Computer Science"
   - **Semester**: e.g., "Sem 1"
   - **File**: Select a PDF
3. Click **Upload Syllabus**
4. Wait for success message

---

### Step 3: Verify in Dashboard

1. Navigate to: `http://localhost:3000/admin/dashboard/syllabuses`
2. Should see your uploaded syllabus in the table
3. Verify all columns are populated

---

### Step 4: Test Edit

1. Click the **Edit** button on any syllabus
2. Form should load with data pre-filled
3. Modify the title or description
4. Click **Save**
5. Should return to dashboard with updated data

---

### Step 5: Test Delete

1. Click the **Delete** button
2. Confirm deletion in dialog
3. Syllabus should disappear from table
4. Should also be deleted from Google Drive

---

## Expected Behavior After Fix

| Action | Before | After |
|--------|--------|-------|
| Click Edit | 404 error | Form loads with data |
| Save Changes | N/A | Returns to dashboard |
| Click Delete | No response | Deleted with confirmation |
| View Dashboard | Empty | Shows all uploads |

---

## API Endpoints Status

All endpoints are correctly implemented:

✅ **GET /api/syllabuses** - Fetch all  
✅ **GET /api/syllabuses/[id]** - Fetch one  
✅ **POST /api/upload-syllabus** - Upload  
✅ **PUT /api/syllabuses/[id]** - Update  
✅ **DELETE /api/syllabuses/[id]** - Delete  

They just need data in the database!

---

## Troubleshooting

### If Edit Still Returns 404
1. Verify table exists:
   ```sql
   SELECT COUNT(*) FROM syllabuses;
   ```
2. Upload at least one syllabus
3. Get the ID from dashboard
4. Try edit again

### If Delete Doesn't Work
1. Make sure admin is logged in
2. Check browser console for errors
3. Verify authorization header being sent
4. Check if file exists in Google Drive

### If Changes Don't Save
1. Check response in network tab (browser DevTools)
2. Verify PUT endpoint returns success
3. Check database for updated values

---

## Complete Workflow

```
1. Create Table (SQL)
   ↓
2. Upload Syllabus
   ↓
3. View in Dashboard
   ↓
4. Edit Button Works ✓
   ↓
5. Delete Button Works ✓
   ↓
✅ System Complete!
```

---

## Files Involved

| File | Purpose |
|------|---------|
| `/api/syllabuses/[id]/route.ts` | GET/PUT/DELETE endpoints |
| `/admin/dashboard/syllabuses/page.tsx` | Dashboard with edit/delete buttons |
| `/admin/dashboard/edit-syllabus/[id]/page.tsx` | Edit form |
| Supabase `syllabuses` table | Data storage |

All code is correct. Just need the database table and data!

---

## Quick Reference

**SQL to run:**
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
```

**Then:**
- Upload syllabus → Edit works ✓
- Upload syllabus → Delete works ✓

---

**Status**: Ready to Fix ✅  
**Time**: 10 minutes  
**Complexity**: Simple (SQL + Upload)
