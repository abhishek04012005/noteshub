-- Syllabuses Table Migration
-- Run this SQL on your Supabase database

-- Create syllabuses table with all required fields
CREATE TABLE IF NOT EXISTS public.syllabuses (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- File Information
  university VARCHAR(255) NOT NULL,
  course VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  
  -- Optional Metadata
  title VARCHAR(500),
  description TEXT,
  author VARCHAR(255),
  
  -- Google Drive Integration
  google_drive_file_id VARCHAR(500) NOT NULL,
  download_url TEXT NOT NULL,
  web_view_link TEXT,
  
  -- File Details
  file_size_mb DECIMAL(10, 2) DEFAULT 0,
  file_name VARCHAR(500),
  
  -- Status & Access Control
  is_free BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS syllabuses_university_idx ON public.syllabuses(university);
CREATE INDEX IF NOT EXISTS syllabuses_course_idx ON public.syllabuses(course);
CREATE INDEX IF NOT EXISTS syllabuses_branch_idx ON public.syllabuses(branch);
CREATE INDEX IF NOT EXISTS syllabuses_semester_idx ON public.syllabuses(semester);
CREATE INDEX IF NOT EXISTS syllabuses_created_at_idx ON public.syllabuses(created_at);
CREATE INDEX IF NOT EXISTS syllabuses_is_free_idx ON public.syllabuses(is_free);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.syllabuses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read free syllabuses
CREATE POLICY "Allow public read access to free syllabuses"
  ON public.syllabuses
  FOR SELECT
  USING (is_free = TRUE);

-- Create policy to allow admins to manage syllabuses (modify this based on your auth setup)
-- This assumes you have an admin table or role
CREATE POLICY "Allow admin full access to syllabuses"
  ON public.syllabuses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Alternative: If using auth.jwt() for admin verification
-- CREATE POLICY "Allow authenticated admins to manage syllabuses"
--   ON public.syllabuses
--   FOR ALL
--   USING (auth.uid() IS NOT NULL);
