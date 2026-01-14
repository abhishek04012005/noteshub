'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MenuBook, ArrowBack } from '@mui/icons-material';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', {
        email,
        password,
      });

      if (response.data.success) {
        // Store login info in localStorage
        localStorage.setItem('adminEmail', response.data.email);
        localStorage.setItem('adminId', response.data.adminId);
        localStorage.setItem('isAdminLoggedIn', 'true');

        // Set cookie for middleware to check
        document.cookie = 'isAdminLoggedIn=true; path=/; max-age=86400'; // 24 hours

        router.push('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <MenuBook sx={{ fontSize: '2.5rem', color: 'var(--primary-600)' }} />
          </div>
          <h1 className={styles.brandTitle}>NotesHub</h1>
          <p className={styles.brandSubtitle}>Educator Dashboard</p>
        </div>

        {/* Login Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            Welcome Back
          </h2>

          {error && (
            <div className={styles.errorBox}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

         
        </div>

        {/* Back Link */}
        <div className={styles.footer}>
          <a href="/" className={styles.backLink}>
            <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
