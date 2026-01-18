-- ===================================================================
-- DATABASE MIGRATION SCRIPT - ADD DOWNLOAD STATUS TRACKING
-- Add download_marked_at column to purchases table
-- ===================================================================

-- Step 1: Add download_marked_at column to purchases table
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS download_marked_at TIMESTAMP;

-- Step 2: Populate download_marked_at for existing purchases with download_url
-- Mark all completed purchases that have download_url as downloaded at their creation time
UPDATE purchases
SET download_marked_at = created_at
WHERE download_marked_at IS NULL 
  AND download_url IS NOT NULL 
  AND download_url != ''
  AND status = 'completed';

-- Step 3: Create index for download_marked_at for better query performance
CREATE INDEX IF NOT EXISTS idx_purchases_download_marked_at ON purchases(download_marked_at);

-- Step 4: Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_purchases_status_download ON purchases(status, download_marked_at);

-- Step 5: Verify the column was added and populated
-- SELECT id, status, created_at, download_marked_at, download_url FROM purchases LIMIT 10;

-- ===================================================================
-- COLUMN INFORMATION:
-- ===================================================================
-- Column Name: download_marked_at
-- Data Type: TIMESTAMP
-- Nullable: YES (NULL means not downloaded yet)
-- Purpose: Stores the timestamp when the notes were downloaded
-- Default: NULL (until downloaded)
-- Populated: For existing completed purchases with download_url, set to created_at

-- ===================================================================
-- USEFUL QUERIES:
-- ===================================================================

-- Get all purchased notes that have been downloaded:
-- SELECT id, customer_email, download_marked_at FROM purchases 
-- WHERE download_marked_at IS NOT NULL
-- ORDER BY download_marked_at DESC;

-- Get all purchased notes that have NOT been downloaded:
-- SELECT id, customer_email, created_at FROM purchases 
-- WHERE download_marked_at IS NULL
-- ORDER BY created_at DESC;

-- Count downloaded vs not downloaded:
-- SELECT 
--   COUNT(*) as total_purchases,
--   COUNT(download_marked_at) as downloaded,
--   COUNT(*) - COUNT(download_marked_at) as not_downloaded
-- FROM purchases;

-- Get average time to download after purchase:
-- SELECT 
--   AVG(EXTRACT(EPOCH FROM (download_marked_at - created_at))/3600) as avg_hours_to_download
-- FROM purchases
-- WHERE download_marked_at IS NOT NULL;

-- Get download statistics by status:
-- SELECT 
--   status,
--   COUNT(*) as total,
--   COUNT(download_marked_at) as downloaded,
--   ROUND(100.0 * COUNT(download_marked_at) / COUNT(*), 2) as download_percentage
-- FROM purchases
-- GROUP BY status
-- ORDER BY status;

-- ===================================================================
-- ROLLBACK (If you need to revert):
-- ===================================================================
-- ALTER TABLE purchases DROP COLUMN download_marked_at;
-- DROP INDEX idx_purchases_download_marked_at;
-- DROP INDEX idx_purchases_status_download;

-- ===================================================================
-- NOTES:
-- ===================================================================
-- 1. This migration is backward compatible - existing purchases will be populated
-- 2. Existing completed purchases with download_url are marked as downloaded at created_at time
-- 3. When admin/student downloads notes in future, download_marked_at gets updated to actual download time
-- 4. Indexes improve query performance for filtering by download status
-- 5. Run this before the admin dashboard features are deployed
-- 6. No data loss - just adds new tracking capability
