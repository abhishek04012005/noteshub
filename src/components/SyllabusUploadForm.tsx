'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SyllabusUploadForm.module.css';
import {
  CheckCircle,
  HourglassEmpty,
  CloudUpload,
  Description as DescriptionIcon,
} from '@mui/icons-material';

interface SyllabusUploadFormProps {
  onSuccess?: () => void;
}

export default function SyllabusUploadForm({ onSuccess }: SyllabusUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    course: '',
    branch: '',
    semester: '',
    title: '',
    description: '',
    author: '',
  });
  const [file, setFile] = useState<File | null>(null);

  // Dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    universities: [] as string[],
    courses: [] as string[],
    branches: [] as string[],
    semesters: [] as string[],
  });

  // Default options
  const defaultSemesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  // Load saved options from localStorage on mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('syllabusFormOptions');
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions) as {
          universities?: string[];
          courses?: string[];
          branches?: string[];
          semesters?: string[];
        };
        setDropdownOptions({
          universities: [...new Set(parsed.universities || [])] as string[],
          courses: [...new Set(parsed.courses || [])] as string[],
          branches: [...new Set(parsed.branches || [])] as string[],
          semesters: [...new Set([...defaultSemesters])] as string[],
        });
      } catch (e) {
        console.error('Error loading saved options:', e);
      }
    } else {
      setDropdownOptions(prev => ({
        ...prev,
        semesters: defaultSemesters,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (
      !formData.university ||
      !formData.course ||
      !formData.branch ||
      !formData.semester ||
      !formData.title ||
      !formData.description ||
      !formData.author ||
      !file
    ) {
      alert('Please fill in all fields');
      return;
    }

    // Save form options to localStorage for future dropdowns
    const savedOptions = localStorage.getItem('syllabusFormOptions');
    const currentOptions = savedOptions ? JSON.parse(savedOptions) : {};
    const updatedOptions = {
      universities: [...new Set([...(currentOptions.universities || []), formData.university])],
      courses: [...new Set([...(currentOptions.courses || []), formData.course])],
      branches: [...new Set([...(currentOptions.branches || []), formData.branch])],
      semesters: [...new Set([...(currentOptions.semesters || []), formData.semester])],
    };
    localStorage.setItem('syllabusFormOptions', JSON.stringify(updatedOptions));

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('university', formData.university);
      uploadFormData.append('course', formData.course);
      uploadFormData.append('branch', formData.branch);
      uploadFormData.append('semester', formData.semester);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('author', formData.author);
      uploadFormData.append('file', file);

      const response = await axios.post('/api/upload-syllabus', uploadFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminEmail')}`,
        },
      });

      setSuccess(true);
      setFormData({
        university: '',
        course: '',
        branch: '',
        semester: '',
        title: '',
        description: '',
        author: '',
      });
      setFile(null);
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : error instanceof Object && 'response' in error && 'data' in (error as any).response
        ? (error as any).response.data?.error || 'Failed to upload syllabus'
        : 'Failed to upload syllabus';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <h2 className={styles.formTitle}>
        <CloudUpload sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
        Upload Syllabus 
      </h2>

      {success && (
        <div className={styles.successMessage}>
          <CheckCircle sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
          Syllabus uploaded successfully!
        </div>
      )}

      <div className={styles.formGrid}>
        {/* University */}
        <div>
          <label className={styles.label}>
            University Name *
          </label>
          <input
            className={styles.input}
            type="text"
            name="university"
            list="university-list"
            placeholder="Type or select university..."
            value={formData.university}
            onChange={handleChange}
            required
          />
          <datalist id="university-list">
            {dropdownOptions.universities.map((uni) => (
              <option key={uni} value={uni} />
            ))}
          </datalist>
        </div>

        {/* Course */}
        <div>
          <label className={styles.label}>
            Course *
          </label>
          <input
            className={styles.input}
            type="text"
            name="course"
            list="course-list"
            placeholder="Type or select course..."
            value={formData.course}
            onChange={handleChange}
            required
          />
          <datalist id="course-list">
            {dropdownOptions.courses.map((course) => (
              <option key={course} value={course} />
            ))}
          </datalist>
        </div>

        {/* Branch */}
        <div>
          <label className={styles.label}>
            Branch *
          </label>
          <input
            className={styles.input}
            type="text"
            name="branch"
            list="branch-list"
            placeholder="Type or select branch..."
            value={formData.branch}
            onChange={handleChange}
            required
          />
          <datalist id="branch-list">
            {dropdownOptions.branches.map((branch) => (
              <option key={branch} value={branch} />
            ))}
          </datalist>
        </div>

        {/* Semester */}
        <div>
          <label className={styles.label}>
            Semester *
          </label>
          <select
            className={styles.select}
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          >
            <option value="">Select Semester</option>
            {dropdownOptions.semesters.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Syllabus Title *
          </label>
          <input
            className={styles.input}
            type="text"
            name="title"
            placeholder="e.g., Data Structures & Algorithms Syllabus"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Description *
          </label>
          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Describe what topics are covered in this syllabus..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        {/* Author */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Author/Department Name *
          </label>
          <input
            className={styles.input}
            type="text"
            name="author"
            placeholder="Your Name or Department"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        {/* File Upload */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            PDF File *
          </label>
          <div 
            className={`${styles.fileUploadContainer} ${file ? styles.hasFile : ''}`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className={styles.fileInputHidden}
              id="file-input"
              required
            />
            <label htmlFor="file-input" className={styles.fileUploadLabel}>
              <div className={styles.fileUploadIcon}>
                <DescriptionIcon sx={{ fontSize: '2rem', color: 'var(--primary)' }} />
              </div>
              <p className={styles.fileUploadText}>
                {file ? file.name : 'Click to upload PDF'}
              </p>
              <p className={styles.fileUploadSubtext}>
                {file ? (
                  <>
                    <CheckCircle sx={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
                    Ready to upload
                  </>
                ) : (
                  'or drag and drop'
                )}
              </p>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={styles.submitButton}
      >
        {loading ? (
          <>
            <HourglassEmpty sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Uploading...
          </>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Upload Syllabus
          </>
        )}
      </button>

      <p className={styles.footerText}>
        Maximum file size: 50MB | Supported format: PDF only |  for all students
      </p>
    </form>
  );
}
