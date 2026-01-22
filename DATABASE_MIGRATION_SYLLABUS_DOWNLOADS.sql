-- Create syllabus_downloads table for tracking free syllabus downloads
CREATE TABLE IF NOT EXISTS syllabus_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  syllabus_id UUID NOT NULL REFERENCES syllabuses(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_syllabus_downloads_syllabus_id ON syllabus_downloads(syllabus_id);
CREATE INDEX idx_syllabus_downloads_email ON syllabus_downloads(student_email);
CREATE INDEX idx_syllabus_downloads_created_at ON syllabus_downloads(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_syllabus_downloads_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_syllabus_downloads_timestamp
BEFORE UPDATE ON syllabus_downloads
FOR EACH ROW
EXECUTE FUNCTION update_syllabus_downloads_timestamp();

-- Add comment for documentation
COMMENT ON TABLE syllabus_downloads IS 'Tracks downloads of free syllabuses with student information for admin analytics';
COMMENT ON COLUMN syllabus_downloads.student_name IS 'Name of student downloading the syllabus';
COMMENT ON COLUMN syllabus_downloads.student_email IS 'Email of student downloading the syllabus';
