'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../download.module.css';
import Loader from '../../../../components/Loader';
import SuccessModal from '../../../../components/SuccessModal';
import {
  ArrowBack,
  Download,
  Email,
  Person,
  ErrorOutline,
} from '@mui/icons-material';
import Link from 'next/link';

interface Syllabus {
  id: string;
  title: string;
  download_url: string;
  university: string;
  course: string;
  branch: string;
  semester: string;
}

export default function SyllabusDownloadPage() {
  const params = useParams();
  const router = useRouter();
  const syllabusId = params.id as string;

  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Fetch syllabus details
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/syllabuses/${syllabusId}`);
        if (response.data.data) {
          setSyllabus(response.data.data);
        } else {
          setError('Syllabus not found');
        }
      } catch (err) {
        console.error('Error fetching syllabus:', err);
        setError('Failed to load syllabus');
      } finally {
        setLoading(false);
      }
    };

    if (syllabusId) {
      fetchSyllabus();
    }
  }, [syllabusId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Store download record in database
      const downloadResponse = await axios.post('/api/syllabuses/downloads', {
        syllabus_id: syllabusId,
        student_name: formData.name,
        student_email: formData.email,
      });

      if (downloadResponse.data.success) {
        if (syllabus?.download_url) {
          setDownloadLink(syllabus.download_url);
          // Auto-download the file
          setTimeout(() => {
            window.open(syllabus.download_url, '_blank');
          }, 500);
        }
        setShowSuccess(true);
      }
    } catch (err: any) {
      console.error('Error processing download:', err);
      setError(err.response?.data?.error || 'Failed to process download. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadClick = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push('/student/syllabuses');
  };

  if (loading) {
    return <Loader message="Loading syllabus..." size="large" fullScreen={true} />;
  }

  if (!syllabus) {
    return (
      <main className={styles.main}>
        <header className={styles.headerFixed}>
          <div className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>
              <Download sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
              Download Syllabus
            </h1>
          </div>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.card}>
              <div className={styles.successIcon}>
                <ErrorOutline sx={{ fontSize: '3rem', color: 'var(--error)' }} />
              </div>
              <h1 className={styles.successTitle}>Syllabus Not Found</h1>
              <p className={styles.message}>The syllabus you're looking for doesn't exist.</p>
              <Link href="/student/syllabuses" className={styles.continueBtn}>
                <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Back to Syllabuses
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.headerFixed}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>
            <Download sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Download Syllabus
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.card}>
            {/* Success Icon */}
            <div className={styles.successIcon}>
              <Download sx={{ fontSize: '3rem', color: 'var(--secondary)' }} />
            </div>

            {/* Heading */}
            <h1 className={styles.successTitle}>
              {syllabus.title}
            </h1>

            {/* Syllabus Details */}
            <div className={styles.syllabusInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>University:</span>
                <span className={styles.infoValue}>{syllabus.university}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Course:</span>
                <span className={styles.infoValue}>{syllabus.course}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Branch:</span>
                <span className={styles.infoValue}>{syllabus.branch}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Semester:</span>
                <span className={styles.infoValue}>{syllabus.semester}</span>
              </div>
            </div>

            {/* Message */}
            <p className={styles.message}>
              Please enter your details to get the download link
            </p>

            {/* Error Box */}
            {error && (
              <div className={styles.errorBox}>
                <ErrorOutline sx={{ fontSize: '1.25rem' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Download Form */}
            <form onSubmit={handleSubmit} className={styles.downloadForm}>
              {/* Name Field */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  <Person sx={{ fontSize: '1rem' }} />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={styles.input}
                  required
                />
              </div>

              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  <Email sx={{ fontSize: '1rem' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={styles.input}
                  required
                />
              </div>

              {/* Download Button */}
              <button
                type="submit"
                disabled={submitting}
                className={styles.downloadBtn}
              >
                <Download sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                {submitting ? 'Processing...' : 'Download'}
              </button>
            </form>

            {/* Info Box */}
            <div className={styles.infoBox}>
              <p className={styles.infoBgText}>
                <ErrorOutline sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
                <span style={{ fontWeight: 600 }}>Note:</span> Your information is secure and will only be used for this download.
              </p>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/student/syllabuses"
              className={styles.continueBtn}
            >
              <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Back to Syllabuses
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          isOpen={showSuccess}
          title="Download Ready!"
          message={`Redirecting in 5 seconds...`}
          onClose={handleCloseSuccess}
          autoCloseDuration={5000}
        />
      )}
    </main>
  );
}
