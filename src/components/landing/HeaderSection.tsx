'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Close, Menu, MenuBook } from '@mui/icons-material';
import styles from './HeaderSection.module.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Download Notes', href: '/student/browse' },
  { label: 'Download Syllabus', href: '/student/syllabus' },
];

export function HeaderSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <div className={styles.logoIcon}>
            <MenuBook sx={{ fontSize: '1.4rem', color: 'var(--background)' }} />
          </div>
          <div className={styles.logoTextGroup}>
            <span className={styles.logoText}>NotesHub</span>
            <span className={styles.logoSubtext}>Study resources</span>
          </div>
        </Link>

        <div className={styles.desktopNav}>
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} className={styles.desktopNavLink}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <Close sx={{ fontSize: '1.25rem' }} /> : <Menu sx={{ fontSize: '1.25rem' }} />}
          </button>

          <Link href="/admin/login" className={styles.adminBtn} onClick={() => setIsMenuOpen(false)}>
            Admin
          </Link>
        </div>
      </div>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`} aria-label="Primary navigation">
        {navLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
