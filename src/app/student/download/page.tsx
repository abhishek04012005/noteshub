'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './download.module.css';

interface Purchase {
  download_url: string;
  notes_id: string;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const email = searchParams.get('email');
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!email) return;

      try {
        const response = await axios.get(`/api/purchases?email=${email}`);
        if (response.data.data && response.data.data.length > 0) {
          const latestPurchase = response.data.data[0];
          setPurchase(latestPurchase);
        }
      } catch (error) {
        console.error('Error fetching purchase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [email]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading your download...</p>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.headerFixed}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>📥 Download</h1>
        </div>
      </header>

      {/* Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.card}>
            {/* Success Icon */}
            <div className={styles.successIcon}>🎉</div>

            {/* Heading */}
            <h1 className={styles.successTitle}>
              Payment Successful!
            </h1>

            {/* Message */}
            <p className={styles.message}>
              Thank you for your purchase. Your download link has been sent to<br />
              <span className={styles.emailHighlight}>{email}</span>
            </p>

            {/* Download Button */}
            {purchase && (
              <div className={styles.downloadSection}>
                <a
                  href={purchase.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                >
                  📥 Download Your Notes
                </a>
              </div>
            )}

            {/* Info Box */}
            <div className={styles.infoBox}>
              <p className={styles.infoBgText}>
                <span style={{ fontWeight: 600 }}>💡 Tip:</span> The download link is also available in your email inbox for future reference.
              </p>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/student/browse"
              className={styles.continueBtn}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.fallback}>
          <div className={styles.fallbackContent}>
            <div className={styles.fallbackSpinner}></div>
            <p className={styles.fallbackText}>Loading...</p>
          </div>
        </div>
      }
    >
      <DownloadContent />
    </Suspense>
  );
}
