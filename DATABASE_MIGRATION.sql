-- ===================================================================
-- DATABASE MIGRATION SCRIPT FOR NOTES MARKETPLACE
-- Add new fields to notes table
-- ===================================================================

-- Step 1: Add new columns to existing notes table
-- If the notes table already has data, we'll add columns with default values

ALTER TABLE notes
ADD COLUMN IF NOT EXISTS university VARCHAR(255),
ADD COLUMN IF NOT EXISTS course VARCHAR(255),
ADD COLUMN IF NOT EXISTS semester VARCHAR(50),
ADD COLUMN IF NOT EXISTS chapter_no VARCHAR(100),
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS discounted_price DECIMAL(10, 2);

-- Step 2: Migration for existing price data to new price columns
-- This updates records that have old 'price' field to use new price structure
UPDATE notes 
SET 
  original_price = COALESCE(original_price, CAST(price AS DECIMAL(10, 2)) * 1.5),
  discounted_price = COALESCE(discounted_price, CAST(price AS DECIMAL(10, 2)))
WHERE original_price IS NULL OR discounted_price IS NULL;

-- Step 3: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_university ON notes(university);
CREATE INDEX IF NOT EXISTS idx_notes_course ON notes(course);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON notes(semester);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_chapter ON notes(chapter_no);
CREATE INDEX IF NOT EXISTS idx_notes_university_course_semester ON notes(university, course, semester);

-- Step 4: Verify the table structure
-- Run this to check the final table structure:
-- SELECT * FROM information_schema.columns WHERE table_name = 'notes';

-- ===================================================================
-- NOTES ON COLUMNS:
-- ===================================================================
-- university       : Name of the university (e.g., "IIT Delhi", "Delhi University")
-- course          : Course name (e.g., "B.Tech CSE", "B.Sc Physics")
-- semester        : Semester (e.g., "Sem 1", "Sem 2")
-- chapter_no      : Chapter number (e.g., "Chapter 1", "Ch 5")
-- original_price  : Original/marked price of the notes
-- discounted_price: Selling/discounted price of the notes

-- ===================================================================
-- OPTIONAL: If you want to reset and create a fresh table structure:
-- ===================================================================
-- DROP TABLE IF EXISTS notes CASCADE;
-- 
-- CREATE TABLE notes (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   university VARCHAR(255),
--   course VARCHAR(255),
--   semester VARCHAR(50),
--   subject VARCHAR(255) NOT NULL,
--   chapter_no VARCHAR(100),
--   title VARCHAR(500) NOT NULL,
--   description TEXT,
--   original_price DECIMAL(10, 2) NOT NULL,
--   discounted_price DECIMAL(10, 2) NOT NULL,
--   author VARCHAR(255) NOT NULL,
--   google_drive_file_id VARCHAR(500),
--   download_url TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ===================================================================
-- HELPER QUERIES FOR ANALYTICS:
-- ===================================================================

-- Get average discount percentage:
-- SELECT 
--   ROUND(AVG((original_price - discounted_price) / original_price * 100), 2) as avg_discount_percentage
-- FROM notes
-- WHERE original_price > 0;

-- Get most common university, course, semester combinations:
-- SELECT 
--   university, course, semester, COUNT(*) as notes_count
-- FROM notes
-- WHERE university IS NOT NULL AND course IS NOT NULL
-- GROUP BY university, course, semester
-- ORDER BY notes_count DESC;

-- Get revenue lost due to discounts:
-- SELECT 
--   ROUND(SUM((original_price - discounted_price) * sales_count), 2) as total_discount_value
-- FROM (
--   SELECT 
--     original_price, discounted_price,
--     COUNT(p.id) as sales_count
--   FROM notes n
--   LEFT JOIN purchases p ON n.id = p.notes_id
--   GROUP BY n.id
-- ) as discount_calc;
