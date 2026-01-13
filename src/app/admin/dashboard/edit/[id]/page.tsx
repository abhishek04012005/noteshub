'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import EditNotesForm from '@/components/EditNotesForm';
import styles from '../../upload/upload.module.css';

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
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
            <h1 className={styles.title}>Edit Notes</h1>
            <p className={styles.subtitle}>Update your notes details and pricing</p>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className={styles.formContainer}>
        <EditNotesForm 
          noteId={noteId}
          onSuccess={() => router.push('/admin/dashboard')}
        />
      </div>
    </main>
  );
}
