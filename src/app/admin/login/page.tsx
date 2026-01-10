'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, do simple validation
      // TODO: Implement proper authentication with Supabase
      if (
        email === process.env.NEXT_PUBLIC_APP_URL ||
        password === 'admin'
      ) {
        localStorage.setItem('adminToken', 'temp_token');
        localStorage.setItem('adminEmail', email);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <div className={styles.brandSection}>
          <div className={styles.logo}>📚</div>
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
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
