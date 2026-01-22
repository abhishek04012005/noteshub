'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowBack, Edit, DeleteOutline } from '@mui/icons-material';
import AdminNavbar from '@/components/AdminNavbar';
import styles from './edit-syllabus.module.css';

interface Syllabus {
  id: string;
  university: string;
  course: string;
  branch: string;
  semester: string;
  title?: string;
  description?: string;
  author?: string;
  created_at: string;
}

export default function EditSyllabusPage() {
  const router = useRouter();
  const params = useParams();
  const syllabusId = params?.id as string;
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const defaultSemesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

  const [formData, setFormData] = useState<Syllabus>({
    id: '',
    university: '',
    course: '',
    branch: '',
    semester: '',
    title: '',
    description: '',
    author: '',
    created_at: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    universities: [] as string[],
    courses: [] as string[],
    branches: [] as string[],
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    setIsAdmin(true);
    fetchSyllabus();
    loadDropdownOptions();
  }, [router, syllabusId]);

  const loadDropdownOptions = () => {
    const savedOptions = localStorage.getItem('syllabusFormOptions');
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions);
        setDropdownOptions({
          universities: parsed.universities || [],
          courses: parsed.courses || [],
          branches: parsed.branches || [],
        });
      } catch (e) {
        console.error('Error loading options:', e);
      }
    }
  };

  const fetchSyllabus = async () => {
    try {
      if (!syllabusId) {
        console.warn('No syllabusId provided');
        setError('Syllabus ID is missing');
        setLoading(false);
        return;
      }
      
      console.log(`Fetching syllabus with ID: ${syllabusId}`);
      
      const response = await axios.get(`/api/syllabuses/${syllabusId}`);
      console.log('Syllabus fetched:', response.data);
      
      if (response.data.success && response.data.data) {
        setFormData(response.data.data);
        setError('');
      } else {
        setError('Syllabus not found');
      }
    } catch (err: any) {
      console.error('Error fetching syllabus:', err.response?.data || err.message);
      
      if (err.response?.status === 404) {
        setError(`Syllabus not found. ID: ${syllabusId}. Check if it exists in the database.`);
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.error || 'Internal server error'}`);
      } else {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to load syllabus';
        setError(`Failed to load: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    if (!formData.university || !formData.course || !formData.branch || !formData.semester) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const adminEmail = localStorage.getItem('adminEmail');
      console.log('📝 Update request:', { syllabusId, adminEmail });

      const response = await axios.put(`/api/syllabuses/${syllabusId}`, {
        university: formData.university,
        course: formData.course,
        branch: formData.branch,
        semester: formData.semester,
        title: formData.title,
        description: formData.description,
        author: formData.author,
      }, {
        headers: {
          Authorization: `Bearer ${adminEmail}`,
        },
      });

      console.log('✅ Update response:', response.data);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/dashboard/syllabuses');
        }, 2000);
      }
    } catch (err: any) {
      console.error('❌ Error updating syllabus:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update syllabus';
      setError(`Failed to update: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this syllabus? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const adminEmail = localStorage.getItem('adminEmail');
      console.log('🗑️ Delete request:', { syllabusId, adminEmail });

      const response = await axios.delete(`/api/syllabuses/${syllabusId}`, {
        headers: {
          Authorization: `Bearer ${adminEmail}`,
        },
      });

      console.log('✅ Delete response:', response.data);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/dashboard/syllabuses');
        }, 1500);
      }
    } catch (err: any) {
      console.error('❌ Error deleting syllabus:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete syllabus';
      setError(`Failed to delete: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className={styles.loadingState}>
        <p className={styles.loadingStateText}>Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p className={styles.loadingStateText}>Loading syllabus details...</p>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <button
                onClick={() => router.back()}
                className={styles.backBtn}
              >
                <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Back
              </button>
              <h1 className={styles.title}>Edit Syllabus</h1>
              <p className={styles.subtitle}>Update syllabus details</p>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2 className={styles.formTitle}>
                <Edit sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
                Syllabus Information
              </h2>

              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>Syllabus updated successfully!</div>}

              <div className={styles.formGrid}>
                {/* University */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>University *</label>
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
                  <label className={styles.label}>Course *</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech, B.Sc"
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
                  <label className={styles.label}>Branch *</label>
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
                  <label className={styles.label}>Semester *</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Semester</option>
                    {defaultSemesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    placeholder="e.g., Complete Syllabus"
                    className={styles.input}
                  />
                </div>

                {/* Author */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author || ''}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={styles.input}
                  />
                </div>

                {/* Description */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Add details about this syllabus..."
                    className={styles.textarea}
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={saving}
                  className={styles.submitBtn}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className={styles.deleteBtn}
                >
                  <DeleteOutline sx={{ fontSize: '1rem', marginRight: '0.25rem' }} style={{ display: 'inline' }} />
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
