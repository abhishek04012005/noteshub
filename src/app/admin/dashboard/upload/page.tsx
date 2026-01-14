'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import UploadNotesForm from '@/components/UploadNotesForm';
import styles from './upload.module.css';

export default function AdminUploadPage() {
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
            <h1 className={styles.title}>Upload New Notes</h1>
            <p className={styles.subtitle}>Share your notes with students</p>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <UploadNotesForm onSuccess={() => router.push('/admin/dashboard')} />
        </div>
      </div>
    </main>
  );
}
