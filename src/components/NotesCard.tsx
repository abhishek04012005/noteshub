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

  // Create URL path from university, course, subject, and chapter
  const createUrlPath = () => {
    const university = notes.university?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    const course = notes.course?.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '') || 'unknown';
    const subject = notes.subject?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    const chapter = notes.chapter_no?.toLowerCase().replace(/\s+/g, '-') || 'chapter1';
    
    return `/student/notes/${university}/${course}/${subject}/${chapter}`;
  };

  const notesLink = createUrlPath();

  return (
    <Link href={notesLink} className={styles.cardLink}>
      <div className={styles.card}>
        {/* Image Placeholder */}
        <div className={styles.imageContainer}>
          <MenuBook sx={{ fontSize: '2.5rem', color: 'white' }} />
        </div>

        <div className={styles.content}>
          {/* University, Course, Branch, Semester Badge */}
          {(notes.university || notes.course || notes.branch || notes.semester) && (
            <span className={styles.badge}>
              {[notes.university, notes.course, notes.branch, notes.semester].filter(Boolean).join(' • ')}
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

export function NotesList({
  searchQuery = '',
  filterUniversity = '',
  filterCourse = '',
  filterBranch = '',
  filterSemester = '',
  filterSubject = '',
}: {
  searchQuery?: string;
  filterUniversity?: string;
  filterCourse?: string;
  filterBranch?: string;
  filterSemester?: string;
  filterSubject?: string;
}) {
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

  // Filter notes based on search query and filters
  const filteredNotes = notes.filter((note) => {
    // Search query filter
    const matchesSearch = !searchQuery.trim() ||
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // University filter (exact match after trim)
    const matchesUniversity = !filterUniversity ||
      note.university?.trim().toLowerCase() === filterUniversity.trim().toLowerCase();

    // Course filter (exact match after trim)
    const matchesCourse = !filterCourse ||
      note.course?.trim().toLowerCase() === filterCourse.trim().toLowerCase();

    // Branch filter (exact match after trim)
    const matchesBranch = !filterBranch ||
      note.branch?.trim().toLowerCase() === filterBranch.trim().toLowerCase();

    // Semester filter (exact match after trim)
    const matchesSemester = !filterSemester ||
      note.semester?.trim().toLowerCase() === filterSemester.trim().toLowerCase();

    // Subject filter (exact match after trim)
    const matchesSubject = !filterSubject ||
      note.subject?.trim().toLowerCase() === filterSubject.trim().toLowerCase();

    return matchesSearch && matchesUniversity && matchesCourse && matchesBranch && matchesSemester && matchesSubject;
  });

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

  if (filteredNotes.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>
          No notes found matching your filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.resultsInfo}>
        <p>Found <strong>{filteredNotes.length}</strong> note{filteredNotes.length !== 1 ? 's' : ''}</p>
      </div>
      <div className={styles.listContainer}>
        {filteredNotes.map((note) => (
          <NotesCard key={note.id} notes={note} />
        ))}
      </div>
    </>
  );
}
