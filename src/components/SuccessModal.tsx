'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Close } from '@mui/icons-material';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseDuration?: number;
}

export default function SuccessModal({
  isOpen,
  title = 'Success',
  message,
  onClose,
  autoCloseDuration = 3000,
}: SuccessModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);

    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className={styles.closeButton}
          aria-label="Close"
        >
          <Close sx={{ fontSize: '1.5rem' }} />
        </button>

        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <CheckCircle sx={{ fontSize: '3rem' }} />
          </div>

          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>

          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
