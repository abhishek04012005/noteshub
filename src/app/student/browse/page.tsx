'use client';

import { NotesList } from '@/components/NotesCard';
import Link from 'next/link';
import styles from './browse.module.css';

export default function BrowseNotesPage() {
  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.backLink}>
            ← Back Home
          </Link>
          <h1 className={styles.title}>
            Browse All Notes
          </h1>
          <p className={styles.subtitle}>
            Explore our collection of quality study materials
          </p>
        </div>
      </header>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <NotesList />
        </div>
      </div>
    </main>
  );
}
