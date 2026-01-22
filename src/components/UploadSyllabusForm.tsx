'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UploadSyllabusForm.module.css';
import {
  CheckCircle,
  Rocket,
  CloudUpload,
} from '@mui/icons-material';

interface UploadSyllabusFormProps {
  onSuccess?: () => void;
}

export default function UploadSyllabusForm({ onSuccess }: UploadSyllabusFormProps) {
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

  // Dropdown options for previously entered values
  const [dropdownOptions, setDropdownOptions] = useState({
    universities: [] as string[],
    courses: [] as string[],
    branches: [] as string[],
    semesters: [] as string[],
  });

  // Default semesters
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
        setDropdownOptions(prev => ({
          ...prev,
          semesters: defaultSemesters,
        }));
      }
    } else {
      setDropdownOptions(prev => ({
        ...prev,
        semesters: defaultSemesters,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      !file
    ) {
      alert('Please fill in all required fields (marked with *)');
      return;
    }

    // Validate file is PDF
    if (!file.type.includes('pdf')) {
      alert('Please select a PDF file');
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
      uploadFormData.append('title', formData.title || `${formData.university} - ${formData.branch} Syllabus`);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('author', formData.author || 'Admin');
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
        <Rocket sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
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
        <div className={styles.formGroup}>
          <label className={styles.label}>University</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            placeholder="e.g., DTU, VIT, IIT"
            list="universities"
            className={styles.input}
            required
          />
          <datalist id="universities">
            {dropdownOptions.universities.map((uni) => (
              <option key={uni} value={uni} />
            ))}
          </datalist>
        </div>

        {/* Course */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Course Name</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="e.g., B.Tech, B.Sc, M.Tech"
            list="courses"
            className={styles.input}
            required
          />
          <datalist id="courses">
            {dropdownOptions.courses.map((course) => (
              <option key={course} value={course} />
            ))}
          </datalist>
        </div>

        {/* Branch */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="e.g., CSE, ECE, ME"
            list="branches"
            className={styles.input}
            required
          />
          <datalist id="branches">
            {dropdownOptions.branches.map((branch) => (
              <option key={branch} value={branch} />
            ))}
          </datalist>
        </div>

        {/* Semester */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Semester</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select Semester</option>
            {dropdownOptions.semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Syllabus Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Data Structures & Algorithms"
            className={styles.input}
          />
        </div>

        {/* Author */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Author Name (Optional)</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Your name or organization"
            className={styles.input}
          />
        </div>

        {/* Description */}
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label}>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Add details about this syllabus..."
            className={styles.textarea}
            rows={4}
          />
        </div>

        {/* File Upload */}
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label}>Syllabus PDF File</label>
          <div className={styles.fileInputWrapper}>
            <CloudUpload sx={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--secondary)' }} />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className={styles.fileInput}
              required
            />
            <p className={styles.fileName}>
              {file ? file.name : 'Click to select or drag PDF file'}
            </p>
            <p className={styles.fileHint}>Maximum size: 50MB</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className={styles.buttonGroup}>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? 'Uploading...' : 'Upload Syllabus'}
        </button>
      </div>
    </form>
  );
}
