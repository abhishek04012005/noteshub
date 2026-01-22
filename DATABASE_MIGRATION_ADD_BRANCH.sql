-- ===================================================================
-- DATABASE MIGRATION: ADD BRANCH COLUMN TO SYLLABUSES TABLE
-- Run this if table exists but branch column is missing
-- ===================================================================

-- Step 1: Add branch column to existing syllabuses table
ALTER TABLE syllabuses 
ADD COLUMN branch VARCHAR(255) NOT NULL DEFAULT 'General';

-- Step 2: Update branch values based on data (if needed)
-- Uncomment and modify if you need to set specific branch values
-- UPDATE syllabuses SET branch = 'Computer Science' WHERE id IS NOT NULL;

-- Step 3: Create index for branch column
CREATE INDEX IF NOT EXISTS idx_syllabuses_branch ON syllabuses(branch);

-- Step 4: Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_syllabuses_university_branch_semester 
ON syllabuses(university, branch, semester);

-- Step 5: Verify the column was added
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'syllabuses' 
-- AND column_name = 'branch';

-- ===================================================================
-- If you need to make branch values unique/not have default:
-- ===================================================================
-- ALTER TABLE syllabuses 
-- ALTER COLUMN branch DROP DEFAULT;

-- ===================================================================
-- ROLLBACK (if something goes wrong):
-- ===================================================================
-- ALTER TABLE syllabuses DROP COLUMN branch;
