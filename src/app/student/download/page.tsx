'use client';


import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './download.module.css';
import {
  ArrowBack,
  HourglassEmpty,
  EmojiEvents,
  Download,
  ErrorOutline,
  Info,
} from '@mui/icons-material';

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
  const [paymentStatus, setPaymentStatus] = useState<'completed' | 'pending' | 'failed' | null>(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/purchases?email=${email}`);
        if (response.data.data && response.data.data.length > 0) {
          const latestPurchase = response.data.data[0];
          // Only set purchase if payment is completed
          if (latestPurchase.status === 'completed') {
            setPurchase(latestPurchase);
            setPaymentStatus('completed');
          } else if (latestPurchase.status === 'failed') {
            setPaymentStatus('failed');
          } else {
            setPaymentStatus('pending');
          }
        } else {
          setPaymentStatus('pending');
        }
      } catch (error) {
        console.error('Error fetching purchase:', error);
        setPaymentStatus('failed');
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

  // Show error if no email provided
  if (!email) {
    return (
      <main className={styles.main}>
        <header className={styles.headerFixed}>
          <div className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>
              <Download sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
              Download
            </h1>
          </div>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.card}>
              <div className={styles.successIcon}>
                <ErrorOutline sx={{ fontSize: '3rem', color: 'var(--primary)' }} />
              </div>
              <h1 className={styles.successTitle}>Invalid Request</h1>
              <p className={styles.message}>Email address is required to access downloads.</p>
              <Link href="/student/browse" className={styles.continueBtn}>
                <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Go Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show pending payment status
  if (paymentStatus === 'pending') {
    return (
      <main className={styles.main}>
        <header className={styles.headerFixed}>
          <div className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>
              <Download sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
              Download
            </h1>
          </div>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.card}>
              <div className={styles.successIcon}>
                <HourglassEmpty sx={{ fontSize: '3rem', color: 'var(--secondary)' }} />
              </div>
              <h1 className={styles.successTitle}>Payment Pending</h1>
              <p className={styles.message}>
                Your payment is being processed. Please wait or check your email for updates.
              </p>
              <Link href="/student/browse" className={styles.continueBtn}>
                <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show failed payment status
  if (paymentStatus === 'failed') {
    return (
      <main className={styles.main}>
        <header className={styles.headerFixed}>
          <div className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>
              <Download sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
              Download
            </h1>
          </div>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.card}>
              <div className={styles.successIcon}>
                <ErrorOutline sx={{ fontSize: '3rem', color: 'var(--primary)' }} />
              </div>
              <h1 className={styles.successTitle}>Payment Failed</h1>
              <p className={styles.message}>
                Your payment could not be completed. Please try again or contact support.
              </p>
              <Link href="/student/browse" className={styles.continueBtn}>
                <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Try Again
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
            Download
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.card}>
            {/* Success Icon */}
            <div className={styles.successIcon}>
              <EmojiEvents sx={{ fontSize: '3rem', color: 'var(--secondary)' }} />
            </div>

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
                  <Download sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                  Download Your Notes
                </a>
              </div>
            )}

            {/* Info Box */}
            <div className={styles.infoBox}>
              <p className={styles.infoBgText}>
                <Info sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
                <span style={{ fontWeight: 600 }}>Tip:</span> The download link is also available in your email inbox for future reference.
              </p>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/student/browse"
              className={styles.continueBtn}
            >
              <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Continue Shopping
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
