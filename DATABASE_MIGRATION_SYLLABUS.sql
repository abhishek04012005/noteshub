-- ===================================================================
-- DATABASE MIGRATION SCRIPT FOR SYLLABUS TABLE
-- Free Syllabus Upload & Download System
-- ===================================================================

-- Step 1: Create syllabuses table
-- This table stores information about uploaded syllabuses
-- They are FREE for students to download
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

-- Step 2: Create indexes for better query performance
-- Indexes for filtering syllabuses
CREATE INDEX IF NOT EXISTS idx_syllabuses_university ON syllabuses(university);
CREATE INDEX IF NOT EXISTS idx_syllabuses_branch ON syllabuses(branch);
CREATE INDEX IF NOT EXISTS idx_syllabuses_semester ON syllabuses(semester);
CREATE INDEX IF NOT EXISTS idx_syllabuses_course ON syllabuses(course);
CREATE INDEX IF NOT EXISTS idx_syllabuses_free ON syllabuses(is_free);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_syllabuses_university_branch_semester 
ON syllabuses(university, branch, semester);

CREATE INDEX IF NOT EXISTS idx_syllabuses_course_semester 
ON syllabuses(course, semester);

-- Index for sorting by most recent
CREATE INDEX IF NOT EXISTS idx_syllabuses_created_at ON syllabuses(created_at DESC);

-- ===================================================================
-- HELPER VIEWS FOR EASY QUERIES:
-- ===================================================================

-- View to get all free syllabuses grouped by university
CREATE OR REPLACE VIEW public.free_syllabuses_grouped AS
SELECT 
  university,
  branch,
  semester,
  COUNT(*) as syllabus_count,
  MAX(created_at) as latest_update
FROM syllabuses
WHERE is_free = TRUE
GROUP BY university, branch, semester
ORDER BY university, branch, semester;

-- ===================================================================
-- USEFUL QUERIES:
-- ===================================================================

-- Get all syllabuses for a specific university, branch, semester
-- SELECT * FROM syllabuses 
-- WHERE university = 'IIT Delhi' 
-- AND branch = 'Computer Science' 
-- AND semester = 'Sem 1'
-- ORDER BY created_at DESC;

-- Get top downloaded syllabuses
-- SELECT title, author, download_count, created_at 
-- FROM syllabuses 
-- WHERE is_free = TRUE
-- ORDER BY download_count DESC 
-- LIMIT 10;

-- Get download statistics
-- SELECT 
--   university, 
--   COUNT(*) as total_syllabuses,
--   SUM(download_count) as total_downloads,
--   ROUND(AVG(download_count), 2) as avg_downloads_per_syllabus
-- FROM syllabuses
-- GROUP BY university
-- ORDER BY total_downloads DESC;

-- Update download count after a download
-- UPDATE syllabuses 
-- SET download_count = download_count + 1
-- WHERE id = 'YOUR_UUID_HERE';

-- ===================================================================
-- NOTES:
-- ===================================================================
-- is_free: Always TRUE for syllabuses (no payment required)
-- download_count: Tracks popularity and usage
-- file_size_mb: Helps with bandwidth management
-- google_drive_file_id: Used to access file via Google Drive API
-- download_url: Direct link for downloading (from Google Drive)
-- Folder structure in Drive: syllabuses/UNIVERSITY/BRANCH/SEMESTER/file.pdf

-- ===================================================================
-- TABLE COLUMNS DESCRIPTION:
-- ===================================================================
-- id                     : Unique identifier (UUID)
-- university             : University name (e.g., "IIT Delhi", "Delhi University")
-- course                 : Course name (e.g., "B.Tech", "B.Sc")
-- branch                 : Branch/Stream (e.g., "Computer Science", "Electronics")
-- semester               : Semester (e.g., "Sem 1", "Sem 2")
-- title                  : Syllabus title
-- description            : Details about what's in the syllabus
-- author                 : Person who uploaded it
-- google_drive_file_id   : File ID from Google Drive
-- download_url           : Direct download link
-- file_size_mb           : File size in MB
-- is_free                : Always TRUE for syllabuses
-- download_count         : Number of times downloaded
-- created_at             : When it was uploaded
-- updated_at             : Last update time

-- ===================================================================
-- BACKUP & RECOVERY:
-- ===================================================================

-- To backup syllabuses table:
-- SELECT * FROM syllabuses;

-- To delete a specific syllabus:
-- DELETE FROM syllabuses WHERE id = 'YOUR_UUID_HERE';

-- To delete all syllabuses for a university:
-- DELETE FROM syllabuses WHERE university = 'IIT Delhi';

