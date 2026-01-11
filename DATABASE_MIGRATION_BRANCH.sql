-- ===================================================================
-- DATABASE MIGRATION SCRIPT - ADD BRANCH FIELD
-- Add branch column to notes table
-- ===================================================================

-- Step 1: Add branch column to existing notes table
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS branch VARCHAR(255);

-- Step 2: Create index for branch column for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_branch ON notes(branch);

-- Step 3: Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_notes_university_course_branch ON notes(university, course, branch);

-- Step 4: Verify the column was added
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'notes' AND column_name = 'branch';

-- ===================================================================
-- ALTERNATIVE: If you want to alter existing column order
-- (This recreates the table, so backup first!)
-- ===================================================================
-- ALTER TABLE notes
-- ADD COLUMN IF NOT EXISTS branch VARCHAR(255)
-- AFTER course;

-- ===================================================================
-- COLUMN INFORMATION:
-- ===================================================================
-- Column Name: branch
-- Data Type: VARCHAR(255)
-- Nullable: YES (NULL allowed)
-- Purpose: Stores branch/specialization name
-- Examples: "CSE", "ECE", "Mechanical", "Computer Science", "Data Science"

-- ===================================================================
-- CURRENT TABLE STRUCTURE (After Migration):
-- ===================================================================
-- Column Name         | Data Type          | Purpose
-- =================== | ================== | ============================
-- id                  | UUID               | Primary key
-- university          | VARCHAR(255)       | University name
-- course              | VARCHAR(255)       | Course name
-- branch              | VARCHAR(255)       | Branch/specialization (NEW)
-- semester            | VARCHAR(50)        | Semester
-- subject             | VARCHAR(255)       | Subject name
-- chapter_no          | VARCHAR(100)       | Chapter number
-- title               | VARCHAR(500)       | Notes title
-- description         | TEXT               | Notes description
-- original_price      | DECIMAL(10,2)      | Original/marked price
-- discounted_price    | DECIMAL(10,2)      | Selling price
-- author              | VARCHAR(255)       | Author name
-- google_drive_file_id| VARCHAR(500)       | Google Drive file ID
-- download_url        | TEXT               | Download link
-- created_at          | TIMESTAMP          | Creation timestamp
-- updated_at          | TIMESTAMP          | Last update timestamp

-- ===================================================================
-- USEFUL QUERIES:
-- ===================================================================

-- Get all branches in the system:
-- SELECT DISTINCT branch FROM notes WHERE branch IS NOT NULL ORDER BY branch;

-- Get notes by university, course, and branch:
-- SELECT * FROM notes 
-- WHERE university = 'IIT Delhi' 
--   AND course = 'B.Tech CSE' 
--   AND branch = 'Artificial Intelligence'
-- ORDER BY created_at DESC;

-- Count notes per branch:
-- SELECT branch, COUNT(*) as note_count
-- FROM notes
-- WHERE branch IS NOT NULL
-- GROUP BY branch
-- ORDER BY note_count DESC;

-- Get popular branches:
-- SELECT 
--   university, course, branch, COUNT(*) as total_notes
-- FROM notes
-- WHERE university IS NOT NULL AND course IS NOT NULL AND branch IS NOT NULL
-- GROUP BY university, course, branch
-- ORDER BY total_notes DESC;

-- Find notes without branch (migration not yet updated):
-- SELECT id, university, course, title FROM notes WHERE branch IS NULL;

-- ===================================================================
-- ROLLBACK (If you need to revert):
-- ===================================================================
-- ALTER TABLE notes DROP COLUMN branch;
-- DROP INDEX idx_notes_branch;
-- DROP INDEX idx_notes_university_course_branch;

-- ===================================================================
-- NOTES:
-- ===================================================================
-- 1. This migration is backward compatible - existing notes work fine
-- 2. Branch field is optional (NULL allowed) for old records
-- 3. New notes should always have a branch value
-- 4. Indexes improve query performance for filtering by branch
-- 5. Run this before deploying the updated code
