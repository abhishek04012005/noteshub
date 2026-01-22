-- ===================================================================
-- VERIFY SYLLABUS TABLE STRUCTURE AND DATA
-- ===================================================================

-- Step 1: Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'syllabuses'
);

-- Step 2: View complete table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'syllabuses'
ORDER BY ordinal_position;

-- Step 3: Check all syllabuses with all data
SELECT 
  id,
  university,
  course,
  branch,
  semester,
  title,
  description,
  author,
  google_drive_file_id,
  download_url,
  web_view_link,
  file_size_mb,
  is_free,
  download_count,
  created_at,
  updated_at
FROM syllabuses
ORDER BY created_at DESC;

-- Step 4: Count total syllabuses
SELECT COUNT(*) as total_syllabuses FROM syllabuses;

-- Step 5: Check for missing download URLs
SELECT id, title, download_url
FROM syllabuses
WHERE download_url IS NULL OR download_url = '';

-- Step 6: Check for missing file IDs
SELECT id, title, google_drive_file_id
FROM syllabuses
WHERE google_drive_file_id IS NULL OR google_drive_file_id = '';

-- Step 7: View syllabuses by university
SELECT 
  university,
  COUNT(*) as count,
  MAX(created_at) as latest_upload
FROM syllabuses
GROUP BY university
ORDER BY count DESC;

-- Step 8: View syllabuses by branch
SELECT 
  branch,
  COUNT(*) as count,
  MAX(created_at) as latest_upload
FROM syllabuses
GROUP BY branch
ORDER BY count DESC;

-- Step 9: Check file sizes
SELECT 
  title,
  university,
  branch,
  file_size_mb,
  ROUND(file_size_mb / 1024, 2) as file_size_gb
FROM syllabuses
ORDER BY file_size_mb DESC;

-- Step 10: List all indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'syllabuses'
ORDER BY indexname;

-- ===================================================================
-- EXAMPLE: Download link formats
-- ===================================================================
-- Correct download link format:
-- https://drive.google.com/uc?export=download&id=FILE_ID

-- View link format (for previewing):
-- https://drive.google.com/file/d/FILE_ID/view

-- Open in new tab:
-- https://drive.google.com/file/d/FILE_ID/view?usp=sharing
