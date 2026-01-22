# API Testing Guide - Syllabus Upload & Download

## Quick Test with cURL

### 1. Upload a Syllabus (POST)

```bash
# Create a test PDF (optional)
# You can use any PDF file

# Upload using cURL
curl -X POST http://localhost:3000/api/upload-syllabus \
  -H "Authorization: Bearer admin@example.com" \
  -F "university=IIT Delhi" \
  -F "course=B.Tech" \
  -F "branch=Computer Science" \
  -F "semester=Sem 1" \
  -F "title=Data Structures Syllabus" \
  -F "description=Complete syllabus for DSA course" \
  -F "author=Dr. John Doe" \
  -F "file=@/path/to/your/file.pdf"
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "university": "IIT Delhi",
    "course": "B.Tech",
    "branch": "Computer Science",
    "semester": "Sem 1",
    "title": "Data Structures Syllabus",
    "description": "Complete syllabus for DSA course",
    "author": "Dr. John Doe",
    "google_drive_file_id": "abc123xyz",
    "download_url": "https://drive.google.com/uc?export=download&id=abc123xyz",
    "file_size_mb": 2.50,
    "is_free": true,
    "created_at": "2024-01-20T10:30:00Z"
  },
  "message": "Syllabus uploaded successfully"
}
```

---

### 2. Fetch All Syllabuses (GET)

```bash
# Get all syllabuses
curl -X GET http://localhost:3000/api/syllabuses

# Get syllabuses for specific university
curl -X GET "http://localhost:3000/api/syllabuses?university=IIT%20Delhi"

# Get syllabuses for specific branch
curl -X GET "http://localhost:3000/api/syllabuses?branch=Computer%20Science"

# Get syllabuses for specific semester
curl -X GET "http://localhost:3000/api/syllabuses?semester=Sem%201"

# Combine filters
curl -X GET "http://localhost:3000/api/syllabuses?university=IIT%20Delhi&branch=Computer%20Science&semester=Sem%201"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "university": "IIT Delhi",
      "course": "B.Tech",
      "branch": "Computer Science",
      "semester": "Sem 1",
      "title": "Data Structures Syllabus",
      "description": "Complete syllabus for DSA course",
      "author": "Dr. John Doe",
      "google_drive_file_id": "abc123xyz",
      "download_url": "https://drive.google.com/uc?export=download&id=abc123xyz",
      "web_view_link": "https://drive.google.com/file/d/abc123xyz/view",
      "file_size_mb": 2.50,
      "is_free": true,
      "download_count": 5,
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 3. Get Single Syllabus (GET)

```bash
curl -X GET http://localhost:3000/api/syllabuses/uuid-here
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "university": "IIT Delhi",
    "course": "B.Tech",
    "branch": "Computer Science",
    "semester": "Sem 1",
    "title": "Data Structures Syllabus",
    "description": "Complete syllabus for DSA course",
    "author": "Dr. John Doe",
    "google_drive_file_id": "abc123xyz",
    "download_url": "https://drive.google.com/uc?export=download&id=abc123xyz",
    "file_size_mb": 2.50,
    "is_free": true,
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```

---

### 4. Update Syllabus (PUT)

```bash
curl -X PUT http://localhost:3000/api/syllabuses/uuid-here \
  -H "Authorization: Bearer admin@example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "university": "IIT Delhi",
    "course": "B.Tech",
    "branch": "Computer Science",
    "semester": "Sem 1",
    "title": "Updated Data Structures Syllabus",
    "description": "Updated description",
    "author": "Dr. Jane Doe"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "university": "IIT Delhi",
    "course": "B.Tech",
    "branch": "Computer Science",
    "semester": "Sem 1",
    "title": "Updated Data Structures Syllabus",
    "description": "Updated description",
    "author": "Dr. Jane Doe",
    "google_drive_file_id": "abc123xyz",
    "download_url": "https://drive.google.com/uc?export=download&id=abc123xyz",
    "file_size_mb": 2.50,
    "is_free": true,
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T11:00:00Z"
  },
  "message": "Syllabus updated successfully"
}
```

---

### 5. Delete Syllabus (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/syllabuses/uuid-here \
  -H "Authorization: Bearer admin@example.com"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Syllabus deleted successfully"
}
```

---

## Using Postman

### Import Collection

1. Create new request
2. Set **Method**: `POST`
3. Set **URL**: `http://localhost:3000/api/upload-syllabus`
4. Go to **Headers** tab:
   ```
   Authorization: Bearer admin@example.com
   ```
5. Go to **Body** tab → Select **form-data**
6. Add fields:
   ```
   university (text): IIT Delhi
   course (text): B.Tech
   branch (text): Computer Science
   semester (text): Sem 1
   title (text): Data Structures Syllabus
   description (text): Complete syllabus...
   author (text): Dr. John Doe
   file (file): Select your PDF
   ```
7. Click **Send**

---

## Using JavaScript/Fetch

```javascript
// Upload Syllabus
const formData = new FormData();
formData.append('university', 'IIT Delhi');
formData.append('course', 'B.Tech');
formData.append('branch', 'Computer Science');
formData.append('semester', 'Sem 1');
formData.append('title', 'Data Structures Syllabus');
formData.append('description', 'Complete syllabus for DSA course');
formData.append('author', 'Dr. John Doe');
formData.append('file', fileInputElement.files[0]);

const response = await fetch('/api/upload-syllabus', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminEmail')}`
  },
  body: formData
});

const data = await response.json();
console.log('Upload response:', data);

// Download from URL
const link = document.createElement('a');
link.href = data.data.download_url;
link.target = '_blank';
link.click();

// Fetch all syllabuses
const response = await fetch('/api/syllabuses');
const data = await response.json();
console.log('Syllabuses:', data.data);

// Fetch filtered
const response = await fetch('/api/syllabuses?university=IIT%20Delhi&branch=Computer%20Science');
const data = await response.json();
console.log('Filtered syllabuses:', data.data);
```

---

## Using Axios (Already in Form)

```javascript
import axios from 'axios';

// Upload
const formData = new FormData();
formData.append('university', 'IIT Delhi');
formData.append('course', 'B.Tech');
formData.append('branch', 'Computer Science');
formData.append('semester', 'Sem 1');
formData.append('title', 'Data Structures Syllabus');
formData.append('description', 'Complete syllabus for DSA course');
formData.append('author', 'Dr. John Doe');
formData.append('file', file);

try {
  const response = await axios.post('/api/upload-syllabus', formData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminEmail')}`
    }
  });
  console.log('Upload success:', response.data);
} catch (error) {
  console.error('Upload error:', error.response.data);
}

// Fetch all
const response = await axios.get('/api/syllabuses');
console.log('All syllabuses:', response.data.data);

// Fetch single
const response = await axios.get(`/api/syllabuses/${syllabusId}`);
console.log('Single syllabus:', response.data.data);

// Update
const response = await axios.put(`/api/syllabuses/${syllabusId}`, {
  university: 'IIT Delhi',
  course: 'B.Tech',
  branch: 'Computer Science',
  semester: 'Sem 1',
  title: 'Updated Title',
  description: 'Updated description',
  author: 'New Author'
}, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminEmail')}`
  }
});
console.log('Update success:', response.data);

// Delete
const response = await axios.delete(`/api/syllabuses/${syllabusId}`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminEmail')}`
  }
});
console.log('Delete success:', response.data);
```

---

## Error Handling

### 400 - Bad Request
```json
{
  "error": "No file provided"
}
```
**Solution**: Add a PDF file to the request

---

### 401 - Unauthorized
```json
{
  "error": "Unauthorized: Admin access required"
}
```
**Solution**: Add Authorization header with admin email:
```
Authorization: Bearer admin@example.com
```

---

### 404 - Not Found
```json
{
  "error": "Syllabus not found"
}
```
**Solution**: Check if the syllabus ID exists

---

### 500 - Server Error
```json
{
  "error": "Failed to upload file to Google Drive: ...",
  "details": {...}
}
```
**Solution**:
1. Check Google Drive credentials in `.env`
2. Check file size (max 50MB)
3. Check network connectivity
4. Check server logs for detailed error

---

## Verification Steps

1. **Upload a syllabus** via dashboard or API
2. **Check Supabase**:
   ```sql
   SELECT * FROM syllabuses ORDER BY created_at DESC LIMIT 1;
   ```
3. **Verify download URL**:
   - Copy `download_url` value
   - Paste in browser
   - PDF should download
4. **Check Google Drive**:
   - Navigate to syllabuses folder
   - Verify file exists in correct location
5. **Test download button** in dashboard
6. **Test edit functionality**
7. **Test delete functionality**

---

## Performance Tips

- **Uploads**: Max 50MB recommended for PDFs
- **Downloads**: Direct Google Drive links are fast
- **Database queries**: Indexed columns for quick filters
- **Caching**: Dashboard caches on first load, refresh for new data

---

## Database View Your Uploaded Data

```sql
-- View all uploads with full details
SELECT 
  id,
  title,
  university,
  branch,
  file_size_mb,
  created_at
FROM syllabuses
ORDER BY created_at DESC;

-- View upload statistics
SELECT 
  DATE(created_at) as upload_date,
  COUNT(*) as uploads,
  ROUND(AVG(file_size_mb), 2) as avg_file_size
FROM syllabuses
GROUP BY DATE(created_at)
ORDER BY upload_date DESC;
```

---

## Troubleshooting Download Links

**Link format**: `https://drive.google.com/uc?export=download&id=FILE_ID`

If download doesn't work:
1. Check file exists in Google Drive
2. Verify FILE_ID is correct
3. Check file permissions in Google Drive
4. Try direct link in incognito/private browser
5. Check network (firewall/proxy blocking)

---

## Success Criteria

- ✅ Upload form accepts file and metadata
- ✅ Data stored in Supabase table
- ✅ File stored in Google Drive
- ✅ Download URL works correctly
- ✅ Dashboard displays all entries
- ✅ Edit updates database
- ✅ Delete removes from both DB and Drive
- ✅ File sizes display correctly
- ✅ Optional fields can be empty
- ✅ AdminNavbar shows on all pages

All systems ready for testing! 🚀
