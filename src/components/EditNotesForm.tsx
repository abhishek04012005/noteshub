'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Notes } from '@/types';
import styles from './UploadNotesForm.module.css';
import {
  CheckCircle,
  HourglassEmpty,
  Save,
  Edit as EditIcon,
} from '@mui/icons-material';

interface EditNotesFormProps {
  noteId: string;
  onSuccess?: () => void;
}

export default function EditNotesForm({ noteId, onSuccess }: EditNotesFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    course: '',
    branch: '',
    semester: '',
    subject: '',
    chapter_no: '',
    title: '',
    description: '',
    original_price: '',
    discounted_price: '',
    author: '',
  });

  // Dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    universities: [] as string[],
    courses: [] as string[],
    branches: [] as string[],
    semesters: [] as string[],
    subjects: [] as string[],
  });

  const defaultSubjects = ['Operating System', 'Data Structures', 'Analysis Design & Algorithm', 'Computer Network'];
  const defaultSemesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  // Load note data and saved options
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch the note
        const response = await axios.get(`/api/notes/${noteId}`);
        const note = response.data.data;
        
        setFormData({
          university: note.university || '',
          course: note.course || '',
          branch: note.branch || '',
          semester: note.semester || '',
          subject: note.subject || '',
          chapter_no: note.chapter_no || '',
          title: note.title || '',
          description: note.description || '',
          original_price: note.original_price?.toString() || '',
          discounted_price: note.discounted_price?.toString() || '',
          author: note.author || '',
        });

        // Load saved options
        const savedOptions = localStorage.getItem('notesFormOptions');
        if (savedOptions) {
          try {
            const parsed = JSON.parse(savedOptions) as {
              universities?: string[];
              courses?: string[];
              branches?: string[];
              semesters?: string[];
              subjects?: string[];
            };
            setDropdownOptions({
              universities: [...new Set(parsed.universities || [])] as string[],
              courses: [...new Set(parsed.courses || [])] as string[],
              branches: [...new Set(parsed.branches || [])] as string[],
              semesters: [...new Set(parsed.semesters || [])] as string[],
              subjects: [...new Set([...defaultSubjects, ...(parsed.subjects || [])])] as string[],
            });
          } catch (e) {
            console.error('Error loading saved options:', e);
            setDropdownOptions(prev => ({
              ...prev,
              subjects: defaultSubjects,
              semesters: defaultSemesters,
            }));
          }
        } else {
          setDropdownOptions(prev => ({
            ...prev,
            subjects: defaultSubjects,
            semesters: defaultSemesters,
          }));
        }
      } catch (error) {
        console.error('Error loading note:', error);
        alert('Failed to load note details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [noteId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (
      !formData.university ||
      !formData.course ||
      !formData.branch ||
      !formData.semester ||
      !formData.subject ||
      !formData.chapter_no ||
      !formData.title ||
      !formData.description ||
      !formData.original_price ||
      !formData.discounted_price ||
      !formData.author
    ) {
      alert('Please fill in all fields');
      return;
    }

    // Save form options to localStorage
    const savedOptions = localStorage.getItem('notesFormOptions');
    const currentOptions = savedOptions ? JSON.parse(savedOptions) : {};
    const updatedOptions = {
      universities: [...new Set([...(currentOptions.universities || []), formData.university])],
      courses: [...new Set([...(currentOptions.courses || []), formData.course])],
      branches: [...new Set([...(currentOptions.branches || []), formData.branch])],
      semesters: [...new Set([...(currentOptions.semesters || []), formData.semester])],
      subjects: [...new Set([...(currentOptions.subjects || []), formData.subject])],
    };
    localStorage.setItem('notesFormOptions', JSON.stringify(updatedOptions));

    setSaving(true);

    try {
      await axios.put(`/api/notes/${noteId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminEmail')}`,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : error instanceof Object && 'response' in error && 'data' in (error as any).response
        ? (error as any).response.data?.error || 'Failed to update notes'
        : 'Failed to update notes';
      alert(`Update failed: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading note details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <h2 className={styles.formTitle}>
        <EditIcon sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
        Edit Notes Details
      </h2>

      {success && (
        <div className={styles.successMessage}>
          <CheckCircle sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
          Notes updated successfully!
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
      </div>

      <button
        type="submit"
        disabled={saving}
        className={styles.submitButton}
      >
        {saving ? (
          <>
            <HourglassEmpty sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Saving...
          </>
        ) : (
          <>
            <Save sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
}
