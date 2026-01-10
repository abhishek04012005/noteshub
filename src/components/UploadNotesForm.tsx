'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './UploadNotesForm.module.css';

interface UploadNotesFormProps {
  onSuccess?: () => void;
}

export default function UploadNotesForm({ onSuccess }: UploadNotesFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    price: '',
    author: '',
  });
  const [file, setFile] = useState<File | null>(null);

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
      !formData.title ||
      !formData.description ||
      !formData.subject ||
      !formData.price ||
      !formData.author ||
      !file
    ) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('price', formData.price);
      uploadFormData.append('author', formData.author);
      uploadFormData.append('file', file);

      const response = await axios.post('/api/upload-notes', uploadFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        subject: '',
        price: '',
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

  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'History', 'Geography', 'Computer Science', 'Economics'];

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
        {/* Title */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Notes Title *
          </label>
          <input
            className={styles.input}
            type="text"
            name="title"
            placeholder="e.g., Physics Chapter 1: Motion"
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

        {/* Subject */}
        <div>
          <label className={styles.label}>
            Subject *
          </label>
          <select
            className={styles.select}
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className={styles.label}>
            Price (₹) *
          </label>
          <input
            className={styles.input}
            type="number"
            name="price"
            placeholder="99"
            value={formData.price}
            onChange={handleChange}
            required
            min="1"
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
