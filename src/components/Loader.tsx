'use client';

import styles from './Loader.module.css';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export default function Loader({
  message = 'Loading...',
  size = 'medium',
  fullScreen = false,
}: LoaderProps) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenContainer}>
        <div className={styles.content}>
          <div className={`${styles.loader} ${styles[size]}`}></div>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.loader} ${styles[size]}`}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
