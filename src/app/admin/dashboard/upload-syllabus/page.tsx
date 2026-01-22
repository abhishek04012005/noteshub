'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import UploadSyllabusForm from '@/components/UploadSyllabusForm';
import styles from './upload-syllabus.module.css';

export default function AdminUploadSyllabusPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    setIsAdmin(true);
  }, [router]);

  if (!isAdmin) {
    return (
      <div className={styles.loadingState}>
        <p className={styles.loadingStateText}>Loading...</p>
      </div>
    );
  }

  return (
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
            <h1 className={styles.title}>Upload New Syllabus</h1>
            <p className={styles.subtitle}>Share your syllabus with students</p>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <UploadSyllabusForm onSuccess={() => router.push('/admin/dashboard/syllabuses')} />
        </div>
      </div>
    </main>
  );
}
