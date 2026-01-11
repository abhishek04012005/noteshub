'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { MenuBook } from '@mui/icons-material';
import { Notes } from '@/types';
import styles from './NotesCard.module.css';

export default function NotesCard({ notes }: { notes: Notes }) {
  // Use discounted_price if available, otherwise fall back to price for backward compatibility
  const displayPrice = notes.discounted_price || notes.price || 0;
  const originalPrice = notes.original_price || (notes.price ? notes.price * 1.5 : 0);
  const discount = originalPrice && displayPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/student/notes/${notes.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        {/* Image Placeholder */}
        <div className={styles.imageContainer}>
          <MenuBook sx={{ fontSize: '2.5rem', color: 'white' }} />
        </div>

        <div className={styles.content}>
          {/* University, Course, Semester Badge */}
          {(notes.university || notes.course || notes.semester) && (
            <span className={styles.badge}>
              {[notes.university, notes.course, notes.semester].filter(Boolean).join(' • ')}
            </span>
          )}

          {/* Subject & Chapter Badge */}
          <div className={styles.badgeRow}>
            <span className={styles.badge}>
              {notes.subject}
            </span>
            {notes.chapter_no && (
              <span className={styles.badge}>
                {notes.chapter_no}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={styles.title}>
            {notes.title}
          </h3>

          {/* Description */}
          <p className={styles.description}>
            {notes.description}
          </p>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerRow}>
              <div className={styles.priceSection}>
                {discount > 0 && (
                  <>
                    <span className={styles.originalPrice}>₹{Math.round(originalPrice)}</span>
                    <span className={styles.discountBadge}>{discount}% OFF</span>
                  </>
                )}
                <span className={styles.price}>₹{Math.round(displayPrice)}</span>
              </div>
              <span className={styles.author}>By {notes.author}</span>
            </div>
            <button 
              className={styles.viewButton}
              >
               Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function NotesList() {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setError(null);
        const response = await axios.get('/api/notes');
        setNotes(response.data.data || []);
      } catch (error: any) {
        console.error('Error fetching notes:', error);
        // Don't show error for 400s - just show empty list
        setError(error.response?.status === 400 ? null : 'Failed to load notes');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className={styles.skeletonContainer}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonContent}>
              <div className={`${styles.skeletonLine} ${styles.skeletonLineSmall}`}></div>
              <div className={styles.skeletonLine}></div>
              <div className={`${styles.skeletonLine} ${styles.skeletonLineSmall}`}></div>
              <div className={styles.skeletonLine}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>
          No notes available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {notes.map((note) => (
        <NotesCard key={note.id} notes={note} />
      ))}
    </div>
  );
}
