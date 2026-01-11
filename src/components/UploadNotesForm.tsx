'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UploadNotesForm.module.css';

interface UploadNotesFormProps {
  onSuccess?: () => void;
}

export default function UploadNotesForm({ onSuccess }: UploadNotesFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    course: '',
    semester: '',
    subject: '',
    chapter_no: '',
    title: '',
    description: '',
    original_price: '',
    discounted_price: '',
    author: '',
  });
  const [file, setFile] = useState<File | null>(null);

  // Dropdown options for previously entered values
  const [dropdownOptions, setDropdownOptions] = useState({
    universities: [] as string[],
    courses: [] as string[],
    semesters: [] as string[],
    subjects: [] as string[],
  });

  // Default options
  const defaultSubjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'History', 'Geography', 'Computer Science', 'Economics'];
  const defaultSemesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  // Load saved options from localStorage on mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('notesFormOptions');
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions) as {
          universities?: string[];
          courses?: string[];
          semesters?: string[];
          subjects?: string[];
        };
        setDropdownOptions({
          universities: [...new Set(parsed.universities || [])] as string[],
          courses: [...new Set(parsed.courses || [])] as string[],
          semesters: [...new Set(parsed.semesters || [])] as string[],
          subjects: [...new Set([...defaultSubjects, ...(parsed.subjects || [])])] as string[],
        });
      } catch (e) {
        console.error('Error loading saved options:', e);
        setDropdownOptions(prev => ({
          ...prev,
          subjects: defaultSubjects,
        }));
      }
    } else {
      setDropdownOptions(prev => ({
        ...prev,
        subjects: defaultSubjects,
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
      !formData.semester ||
      !formData.subject ||
      !formData.chapter_no ||
      !formData.title ||
      !formData.description ||
      !formData.original_price ||
      !formData.discounted_price ||
      !formData.author ||
      !file
    ) {
      alert('Please fill in all fields');
      return;
    }

    // Save form options to localStorage for future dropdowns
    const savedOptions = localStorage.getItem('notesFormOptions');
    const currentOptions = savedOptions ? JSON.parse(savedOptions) : {};
    const updatedOptions = {
      universities: [...new Set([...(currentOptions.universities || []), formData.university])],
      courses: [...new Set([...(currentOptions.courses || []), formData.course])],
      semesters: [...new Set([...(currentOptions.semesters || []), formData.semester])],
      subjects: [...new Set([...(currentOptions.subjects || []), formData.subject])],
    };
    localStorage.setItem('notesFormOptions', JSON.stringify(updatedOptions));

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('university', formData.university);
      uploadFormData.append('course', formData.course);
      uploadFormData.append('semester', formData.semester);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('chapter_no', formData.chapter_no);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('original_price', formData.original_price);
      uploadFormData.append('discounted_price', formData.discounted_price);
      uploadFormData.append('author', formData.author);
      uploadFormData.append('file', file);

      const response = await axios.post('/api/upload-notes', uploadFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      setSuccess(true);
      setFormData({
        university: '',
        course: '',
        semester: '',
        subject: '',
        chapter_no: '',
        title: '',
        description: '',
        original_price: '',
        discounted_price: '',
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
        ? (error as any).response.data?.error || 'Failed to upload notes'
        : 'Failed to upload notes';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <h2 className={styles.formTitle}>
        📤 Upload Your Notes
      </h2>

      {success && (
        <div className={styles.successMessage}>
          ✓ Notes uploaded successfully!
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

        {/* Subject */}
        <div>
          <label className={styles.label}>
            Subject *
          </label>
          <input
            className={styles.input}
            type="text"
            name="subject"
            list="subject-list"
            placeholder="Type or select subject..."
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <datalist id="subject-list">
            {dropdownOptions.subjects.map((sub) => (
              <option key={sub} value={sub} />
            ))}
          </datalist>
        </div>

        {/* Chapter No */}
        <div>
          <label className={styles.label}>
            Chapter Number *
          </label>
          <input
            className={styles.input}
            type="text"
            name="chapter_no"
            placeholder="e.g., Chapter 1"
            value={formData.chapter_no}
            onChange={handleChange}
            required
          />
        </div>

        {/* Title */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Notes Title *
          </label>
          <input
            className={styles.input}
            type="text"
            name="title"
            placeholder="e.g., Motion and Laws of Motion"
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
            placeholder="Describe what topics are covered in these notes..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        {/* Original Price */}
        <div>
          <label className={styles.label}>
            Original Price (₹) *
          </label>
          <input
            className={styles.input}
            type="number"
            name="original_price"
            placeholder="199"
            value={formData.original_price}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        {/* Discounted Price */}
        <div>
          <label className={styles.label}>
            Discounted Price (₹) *
          </label>
          <input
            className={styles.input}
            type="number"
            name="discounted_price"
            placeholder="99"
            value={formData.discounted_price}
            onChange={handleChange}
            required
            min="1"
            max={parseFloat(formData.original_price) || undefined}
          />
        </div>

        {/* Author */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Author Name *
          </label>
          <input
            className={styles.input}
            type="text"
            name="author"
            placeholder="Your Name"
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
              <div className={styles.fileUploadIcon}>📄</div>
              <p className={styles.fileUploadText}>
                {file ? file.name : 'Click to upload PDF'}
              </p>
              <p className={styles.fileUploadSubtext}>
                {file ? '✓ Ready to upload' : 'or drag and drop'}
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
        {loading ? '⏳ Uploading...' : '🚀 Upload Notes'}
      </button>

      <p className={styles.footerText}>
        Maximum file size: 50MB | Supported format: PDF only
      </p>
    </form>
  );
}





