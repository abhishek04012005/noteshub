-- ===================================================================
-- SYLLABUS TABLE QUERIES - Complete Reference
-- ===================================================================

-- ===================================================================
-- 1. IF TABLE DOESN'T EXIST - USE THIS:
-- ===================================================================
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

-- ===================================================================
-- 2. IF TABLE EXISTS BUT MISSING BRANCH - USE THIS:
-- ===================================================================
ALTER TABLE syllabuses 
ADD COLUMN IF NOT EXISTS branch VARCHAR(255) NOT NULL DEFAULT 'General';

-- ===================================================================
-- 3. CREATE INDEXES:
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_syllabuses_university ON syllabuses(university);
CREATE INDEX IF NOT EXISTS idx_syllabuses_branch ON syllabuses(branch);
CREATE INDEX IF NOT EXISTS idx_syllabuses_semester ON syllabuses(semester);
CREATE INDEX IF NOT EXISTS idx_syllabuses_course ON syllabuses(course);
CREATE INDEX IF NOT EXISTS idx_syllabuses_free ON syllabuses(is_free);

CREATE INDEX IF NOT EXISTS idx_syllabuses_university_branch_semester 
ON syllabuses(university, branch, semester);

CREATE INDEX IF NOT EXISTS idx_syllabuses_course_semester 
ON syllabuses(course, semester);

CREATE INDEX IF NOT EXISTS idx_syllabuses_created_at ON syllabuses(created_at DESC);

-- ===================================================================
-- 4. INSERT SYLLABUS:
-- ===================================================================
INSERT INTO syllabuses (
  university, 
  course, 
  branch, 
  semester, 
  title, 
  description, 
  author, 
  google_drive_file_id, 
  download_url, 
  file_size_mb
) VALUES (
  'IIT Delhi',
  'B.Tech',
  'Computer Science',
  'Sem 1',
  'Data Structures Syllabus',
  'Complete syllabus for Data Structures course',
  'admin@example.com',
  'GOOGLE_DRIVE_FILE_ID',
  'https://drive.google.com/uc?id=GOOGLE_DRIVE_FILE_ID&export=download',
  2.5
);

-- ===================================================================
-- 5. GET ALL SYLLABUSES:
-- ===================================================================
SELECT * FROM syllabuses ORDER BY created_at DESC;

-- ===================================================================
-- 6. GET SYLLABUSES BY UNIVERSITY, BRANCH, SEMESTER:
-- ===================================================================
SELECT * FROM syllabuses 
WHERE university = 'IIT Delhi' 
AND branch = 'Computer Science'
AND semester = 'Sem 1'
ORDER BY created_at DESC;

-- ===================================================================
-- 7. GET SYLLABUSES BY COURSE AND SEMESTER:
-- ===================================================================
SELECT * FROM syllabuses 
WHERE course = 'B.Tech'
AND semester = 'Sem 1'
ORDER BY created_at DESC;

-- ===================================================================
-- 8. GET SINGLE SYLLABUS BY ID:
-- ===================================================================
SELECT * FROM syllabuses WHERE id = 'UUID_HERE';

-- ===================================================================
-- 9. UPDATE SYLLABUS:
-- ===================================================================
UPDATE syllabuses 
SET 
  title = 'Updated Title',
  description = 'Updated Description',
  course = 'B.Sc',
  branch = 'Physics',
  author = 'New Author',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'UUID_HERE';

-- ===================================================================
-- 10. DELETE SYLLABUS:
-- ===================================================================
DELETE FROM syllabuses WHERE id = 'UUID_HERE';

-- ===================================================================
-- 11. DELETE ALL SYLLABUSES FOR A UNIVERSITY:
-- ===================================================================
DELETE FROM syllabuses WHERE university = 'IIT Delhi';

-- ===================================================================
-- 12. GET DOWNLOAD STATISTICS:
-- ===================================================================
SELECT 
  university,
  branch,
  semester,
  COUNT(*) as total_syllabuses,
  SUM(download_count) as total_downloads,
  ROUND(AVG(download_count), 2) as avg_downloads
FROM syllabuses
GROUP BY university, branch, semester
ORDER BY total_downloads DESC;

-- ===================================================================
-- 13. GET TOP DOWNLOADED SYLLABUSES:
-- ===================================================================
SELECT title, author, download_count, created_at 
FROM syllabuses 
WHERE is_free = TRUE
ORDER BY download_count DESC 
LIMIT 10;

-- ===================================================================
-- 14. INCREMENT DOWNLOAD COUNT:
-- ===================================================================
UPDATE syllabuses 
SET download_count = download_count + 1
WHERE id = 'UUID_HERE';

-- ===================================================================
-- 15. GET ALL UNIQUE UNIVERSITIES:
-- ===================================================================
SELECT DISTINCT university FROM syllabuses ORDER BY university;

-- ===================================================================
-- 16. GET ALL BRANCHES FOR A UNIVERSITY:
-- ===================================================================
SELECT DISTINCT branch FROM syllabuses 
WHERE university = 'IIT Delhi' 
ORDER BY branch;

-- ===================================================================
-- 17. GET ALL SEMESTERS FOR A BRANCH:
-- ===================================================================
SELECT DISTINCT semester FROM syllabuses 
WHERE university = 'IIT Delhi' 
AND branch = 'Computer Science'
ORDER BY semester;

-- ===================================================================
-- 18. COUNT SYLLABUSES BY BRANCH:
-- ===================================================================
SELECT branch, COUNT(*) as count 
FROM syllabuses 
GROUP BY branch 
ORDER BY count DESC;

-- ===================================================================
-- 19. VERIFY TABLE STRUCTURE:
-- ===================================================================
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'syllabuses' 
ORDER BY ordinal_position;

-- ===================================================================
-- 20. VERIFY INDEXES:
-- ===================================================================
SELECT indexname FROM pg_indexes 
WHERE tablename = 'syllabuses';

-- ===================================================================
-- 21. DROP TABLE (if needed):
-- ===================================================================
-- DROP TABLE IF EXISTS syllabuses CASCADE;

-- ===================================================================
-- 22. GET RECORD COUNT:
-- ===================================================================
SELECT COUNT(*) as total_syllabuses FROM syllabuses;

-- ===================================================================
-- 23. GET RECENT UPLOADS (last 7 days):
-- ===================================================================
SELECT * FROM syllabuses 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- ===================================================================
-- 24. GET SYLLABUSES BY FILE SIZE:
-- ===================================================================
SELECT * FROM syllabuses 
WHERE file_size_mb > 5
ORDER BY file_size_mb DESC;

-- ===================================================================
-- 25. BACKUP ALL SYLLABUSES DATA:
-- ===================================================================
SELECT 
  id,
  university,
  course,
  branch,
  semester,
  title,
  author,
  google_drive_file_id,
  download_url,
  file_size_mb,
  download_count,
  created_at,
  updated_at
FROM syllabuses
ORDER BY created_at DESC;
