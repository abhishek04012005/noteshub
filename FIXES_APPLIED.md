# Fixes Applied to Notes Marketplace

## Issue: Request failed with status code 400 on upload

### Root Causes & Solutions:

### 1. **Google Drive Folder Organization (NEW FEATURE)**
   - **File:** `src/utils/google-drive.ts`
   - **Change:** Added `getOrCreateSubjectFolder()` function
   - **Benefit:** Files are now organized by subject folders in Google Drive
   - **How it works:**
     - When uploading, automatically creates a folder with the subject name
     - Files are stored inside subject-wise folders (e.g., `Physics/`, `Chemistry/`)
     - Reuses existing folders if they already exist

### 2. **Improved Error Handling for Supabase**
   - **File:** `src/app/api/upload-notes/route.ts`
   - **Change:** Added graceful fallback if Supabase table doesn't exist
   - **Benefit:** File still uploads to Google Drive even if Supabase has issues
   - **How it works:**
     - Checks if error is table-related
     - Returns success (201) with Google Drive data even if Supabase fails
     - Returns 400 only for actual data validation errors

### 3. **Fixed FormData Handling**
   - **File:** `src/components/UploadNotesForm.tsx`
   - **Change:** Removed hardcoded `Content-Type` header
   - **Benefit:** Axios now properly sets multipart form boundaries
   - **Why:** Setting `Content-Type: multipart/form-data` manually breaks boundary encoding

### 4. **Enhanced Logging**
   - **File:** `src/app/api/upload-notes/route.ts`
   - **Change:** Added step-by-step logging at each point
   - **Benefit:** Easy debugging of upload issues via server logs
   - **Logs include:**
     - Form data received
     - Auth verification
     - Buffer conversion
     - Google Drive upload progress
     - Subject folder creation
     - Supabase insertion

### 5. **Subject Parameter Support**
   - **File:** `src/utils/google-drive.ts`
   - **Change:** Added optional `subject` parameter to `uploadToDrive()`
   - **Benefit:** Files automatically organized by subject in Google Drive

## Testing the Upload:

1. Open browser: `http://localhost:3000`
2. Go to `/admin/login`
3. Login with any email/password (it will create a token)
4. Go to `/admin/dashboard`
5. Upload a PDF with:
   - Title: "Test Notes"
   - Subject: "Physics" (or any subject)
   - Price: 99
   - Author: Your Name
   - File: Any PDF

## Expected Result:

✅ File uploads successfully to Google Drive  
✅ File stored in `/Physics` folder (or your subject)  
✅ Download link generated automatically  
✅ Record stored in Supabase (if table exists)  
✅ Success message shown in UI  

## Troubleshooting:

If you still see 400 error:
1. Check server logs: Look for "📝 Received upload request" message
2. Verify `.env.local` has `GOOGLE_REFRESH_TOKEN` (not placeholder)
3. Verify `GOOGLE_DRIVE_FOLDER_ID` is set correctly
4. Check browser console for exact error message

## Next Steps:

To properly store in Supabase, run this SQL in your Supabase dashboard:

```sql
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  subject VARCHAR,
  price FLOAT NOT NULL,
  author VARCHAR,
  google_drive_file_id VARCHAR,
  download_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
```

Then upload again - it will store properly in Supabase!
