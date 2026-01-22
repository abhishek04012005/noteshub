# Debug Guide: Edit & Delete Syllabus Issues

## How to Debug

The error handling has been improved with detailed logging. Follow these steps to find the exact error:

### Step 1: Open Browser DevTools

1. Press **F12** or **Right-click → Inspect**
2. Go to **Console** tab
3. Go to **Network** tab

### Step 2: Try to Delete a Syllabus

1. Go to: `/admin/dashboard/syllabuses`
2. Click **Delete** button
3. Confirm deletion

### Step 3: Check Console for Errors

In the **Console** tab, you should see one of these:

**Success:**
```
📝 Delete request: {syllabusId: "abc123", adminEmail: "user@example.com"}
✅ Delete response: {success: true, message: "Syllabus deleted successfully"}
```

**Error - Missing Auth:**
```
❌ Error deleting syllabus: Unauthorized: Admin access required
```
**Fix**: Make sure you're logged in as admin. Check `localStorage.getItem('adminEmail')` in console.

**Error - Not Found (404):**
```
❌ Error deleting syllabus: Syllabus not found
```
**Fix**: The syllabus ID doesn't exist. Check Supabase table.

**Error - Table doesn't exist:**
```
❌ Error deleting syllabus: relation "public.syllabuses" does not exist
```
**Fix**: Run the SQL migration to create the table.

---

### Step 4: Check Network Tab for API Response

1. In **Network** tab, find the DELETE request
2. Click on it
3. Go to **Response** tab
4. You should see JSON response like:
   ```json
   {
     "success": true,
     "message": "Syllabus deleted successfully"
   }
   ```

**If you see an error response:**
```json
{
  "error": "Syllabus not found"
}
```
This means the ID doesn't exist in the database.

---

## Common Issues & Fixes

### Issue 1: "Unauthorized: Admin access required"

**Cause**: Admin not logged in or `adminEmail` not in localStorage  
**Fix**:
```javascript
// In browser console, check:
localStorage.getItem('adminEmail')
// Should return your email, not null

// If null, log in again:
// Go to /admin/login
// Enter credentials
```

### Issue 2: "Syllabus not found" (404)

**Cause**: The ID doesn't exist in Supabase  
**Fix**:
1. Go to Supabase dashboard
2. Check `syllabuses` table
3. Verify the ID exists:
   ```sql
   SELECT COUNT(*) FROM syllabuses WHERE id = 'YOUR_ID';
   ```

### Issue 3: "relation "public.syllabuses" does not exist"

**Cause**: Table hasn't been created yet  
**Fix**: Run this SQL in Supabase:
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

### Issue 4: "PUT request fails with 400"

**Cause**: Missing required fields or validation error  
**Check**:
1. All required fields filled:
   - university
   - course
   - branch
   - semester
2. Check Network tab Response for exact error message

---

## Testing Checklist

- [ ] Open Browser DevTools (F12)
- [ ] Go to `/admin/dashboard/syllabuses`
- [ ] Click Edit button
  - [ ] Check Console for logs
  - [ ] Check if form loads with data
  - [ ] Modify a field
  - [ ] Click Save
  - [ ] Check Console for success message
  - [ ] Verify changes in database
- [ ] Click Delete button
  - [ ] Check Console for logs
  - [ ] Confirm deletion
  - [ ] Check if item removed from table
  - [ ] Verify in Supabase table

---

## Database Verification

Run this in Supabase SQL Editor to verify data:

```sql
-- Check table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'syllabuses'
);

-- Count syllabuses
SELECT COUNT(*) as total FROM syllabuses;

-- View all syllabuses
SELECT id, university, course, branch, semester, created_at 
FROM syllabuses 
ORDER BY created_at DESC;
```

---

## API Response Format

### Successful Delete (200)
```json
{
  "success": true,
  "message": "Syllabus deleted successfully"
}
```

### Successful Update (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "university": "IIT Delhi",
    "course": "B.Tech",
    "branch": "Computer Science",
    "semester": "Sem 1",
    "title": "Updated Title",
    "updated_at": "2024-01-21T..."
  },
  "message": "Syllabus updated successfully"
}
```

### Error Responses
```json
{
  "error": "Error message here"
}
```

---

## Steps to Take Now

1. **Check Console** (F12 → Console)
   - Click Delete button
   - Look for error message
   - Copy the error

2. **Send the Error**
   - The error message will tell us exactly what's wrong
   - Could be: auth issue, missing table, wrong ID, etc.

3. **Common Quick Fixes**
   - Create table with SQL migration
   - Log in again as admin
   - Verify data exists in Supabase

---

## Still Not Working?

Check these in order:
1. ✅ Table exists: `SELECT COUNT(*) FROM syllabuses;`
2. ✅ Data exists: `SELECT * FROM syllabuses LIMIT 1;`
3. ✅ Admin logged in: Check localStorage in console
4. ✅ API responds: Check Network tab
5. ✅ Check error message: Copy from console or alert

The improved error messages will tell you exactly what's wrong!
