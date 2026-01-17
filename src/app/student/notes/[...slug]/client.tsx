'use client';

import { Notes } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  ArrowBack,
  MenuBook,
  School,
  LibraryBooks,
  AccountBalance,
  DateRange,
  ListAlt,
  Error as ErrorIcon,
} from '@mui/icons-material';
import BuyNotesButton from '@/components/BuyNotesButton';
import styles from './notes.module.css';

// Helper function to extract UUID from slug
function extractIdFromSlug(slug: string): string {
  // UUID pattern: 8-4-4-4-12 hex digits
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = slug.match(uuidPattern);
  return match ? match[1] : slug;
}

// Helper function to normalize strings for comparison
function normalizeString(str: string | undefined): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/-/g, ' ')
    .replace(/\.\s*/g, '') // Remove dots and spaces around them
    .replace(/\s+/g, ' ');
}

// Helper function to find note by university, course, subject, chapter
async function findNoteByDetails(slugArray: string[]): Promise<Notes | null> {
  if (slugArray.length >= 3) {
    try {
      const response = await axios.get('/api/notes');
      const allNotes: Notes[] = response.data.data || [];

      if (allNotes.length === 0) {
        console.log('No notes available in database');
        return null;
      }

      console.log('Total notes in database:', allNotes.length);
      console.log('First few notes:', allNotes.slice(0, 3));

      // For 4 parts: university/course/subject/chapter
      if (slugArray.length === 4) {
        const [university, course, subject, chapter] = slugArray;
        const normalizedUniversity = normalizeString(decodeURIComponent(university));
        const normalizedCourse = normalizeString(decodeURIComponent(course));
        const normalizedSubject = normalizeString(decodeURIComponent(subject));
        const normalizedChapter = normalizeString(decodeURIComponent(chapter));

        console.log('Searching for 4-part match:', { normalizedUniversity, normalizedCourse, normalizedSubject, normalizedChapter });

        const found = allNotes.find((note) => {
          const noteUniversity = normalizeString(note.university);
          const noteCourse = normalizeString(note.course);
          const noteSubject = normalizeString(note.subject);
          const noteChapter = normalizeString(note.chapter_no);

          return (
            noteUniversity === normalizedUniversity &&
            noteCourse === normalizedCourse &&
            noteSubject === normalizedSubject &&
            noteChapter === normalizedChapter
          );
        });

        if (found) {
          console.log('Found exact match:', found);
          return found;
        }

        // Fallback: try to match just university, course, subject
        console.log('No exact 4-part match found, trying 3-part match');
        const partialMatch = allNotes.find((note) => {
          const noteUniversity = normalizeString(note.university);
          const noteCourse = normalizeString(note.course);
          const noteSubject = normalizeString(note.subject);

          return (
            noteUniversity === normalizedUniversity &&
            noteCourse === normalizedCourse &&
            noteSubject === normalizedSubject
          );
        });

        if (partialMatch) {
          console.log('Found partial match:', partialMatch);
          return partialMatch;
        }
      }

      // For 3 parts: university/course/subject
      if (slugArray.length === 3) {
        const [university, course, subject] = slugArray;
        const normalizedUniversity = normalizeString(decodeURIComponent(university));
        const normalizedCourse = normalizeString(decodeURIComponent(course));
        const normalizedSubject = normalizeString(decodeURIComponent(subject));

        console.log('Searching for 3-part match:', { normalizedUniversity, normalizedCourse, normalizedSubject });

        const found = allNotes.find((note) => {
          const noteUniversity = normalizeString(note.university);
          const noteCourse = normalizeString(note.course);
          const noteSubject = normalizeString(note.subject);

          return (
            noteUniversity === normalizedUniversity &&
            noteCourse === normalizedCourse &&
            noteSubject === normalizedSubject
          );
        });

        if (found) {
          console.log('Found 3-part match:', found);
          return found;
        }
      }

      console.log('No match found for any slug configuration');
      return null;
    } catch (error) {
      console.error('Error finding note by details:', error);
      return null;
    }
  }
  return null;
}

export default function NotesDetailClient({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const [notes, setNotes] = useState<Notes | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const { slug } = await params;
        console.log('Current URL slug:', slug);
        setLoading(true);

        // Try to find note by nested parameters (3 or 4 segments)
        if (slug.length >= 3) {
          console.log('Attempting to find note by nested params:', slug);
          const foundNotes = await findNoteByDetails(slug);
          if (foundNotes) {
            console.log('Successfully found note by nested params');
            setNotes(foundNotes);
            setLoading(false);
            return;
          } else {
            console.log('Could not find note by nested params, will show error');
            setLoading(false);
            return;
          }
        }

        // Fall back to traditional slug format (single segment with UUID)
        if (slug.length === 1) {
          const extractedId = extractIdFromSlug(slug[0]);
          console.log('Extracted ID from slug:', extractedId);
          setId(extractedId);
          return;
        }

        // If we got here, we couldn't process the URL
        console.log('Could not process URL:', slug);
        setLoading(false);
      } catch (error) {
        console.error('Error loading notes params:', error);
        setLoading(false);
      }
    };

    loadNotes();
  }, [params]);

  useEffect(() => {
    // If notes already loaded from nested route, skip
    if (notes) {
      setLoading(false);
      return;
    }

    if (!id) return;

    const fetchNotes = async () => {
      try {
        const response = await axios.get(`/api/notes/${id}`);
        setNotes(response.data.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [id, notes]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading notes...</p>
        </div>
      </div>
    );
  }

  if (!notes) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>
            <ErrorIcon sx={{ fontSize: '3rem', color: 'var(--primary)' }} />
          </div>
          <p className={styles.errorMessage}>Notes not found</p>
          <Link href="/student/browse" className={styles.errorLink}>
            <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.headerFixed}>
        <div className={styles.headerContainer}>
          <Link href="/student/browse" className={styles.backLink}>
            <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Back to Browse
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.gridLayout}>
              {/* Left Column - Image */}
              <div className={styles.imageSection}>
                {notes.image_url ? (
                  <img
                    src={notes.image_url}
                    alt={notes.title}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <MenuBook sx={{ fontSize: '3rem', color: 'var(--primary)' }} />
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className={styles.detailsSection}>
                <div>
                  {/* Subject Badge */}
                  <span className={styles.badge}>
                    {notes.subject}
                  </span>

                  {/* Title */}
                  <h1 className={styles.title}>
                    {notes.title}
                  </h1>

                  {/* Description */}
                  <p className={styles.description}>
                    {notes.description}
                  </p>

                  {/* Key Details Section */}
                  <div className={styles.keyDetailsGrid}>
                    {notes.university && (
                      <div className={styles.keyDetailItem}>
                        <p className={styles.keyDetailLabel}><School sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} /> University</p>
                        <p className={styles.keyDetailValue}>{notes.university}</p>
                      </div>
                    )}
                    {notes.course && (
                      <div className={styles.keyDetailItem}>
                        <p className={styles.keyDetailLabel}><LibraryBooks sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} /> Course</p>
                        <p className={styles.keyDetailValue}>{notes.course}</p>
                      </div>
                    )}
                    {notes.branch && (
                      <div className={styles.keyDetailItem}>
                        <p className={styles.keyDetailLabel}><AccountBalance sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} /> Branch</p>
                        <p className={styles.keyDetailValue}>{notes.branch}</p>
                      </div>
                    )}
                    {notes.semester && (
                      <div className={styles.keyDetailItem}>
                        <p className={styles.keyDetailLabel}><DateRange sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} /> Semester</p>
                        <p className={styles.keyDetailValue}>{notes.semester}</p>
                      </div>
                    )}
                    {notes.chapter_no && (
                      <div className={styles.keyDetailItem}>
                        <p className={styles.keyDetailLabel}><ListAlt sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} /> Chapter</p>
                        <p className={styles.keyDetailValue}>{notes.chapter_no}</p>
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className={styles.infoDivider}>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <p className={styles.infoLabel}>
                          Author
                        </p>
                        <p className={styles.infoValue}>
                          {notes.author}
                        </p>
                      </div>
                      <div className={styles.infoItem}>
                        <p className={styles.infoLabel}>
                          Published
                        </p>
                        <p className={styles.infoValue}>
                          {new Date(notes.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={styles.infoItem}>
                        <p className={styles.infoLabel}>
                          Last Updated
                        </p>
                        <p className={styles.infoValue}>
                          {new Date(notes.updated_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Button Section */}
                <div className={styles.priceSection}>
                  <div>
                    <p className={styles.priceLabel}>Price</p>
                    <div className={styles.priceDisplay}>
                      {notes.original_price && notes.discounted_price ? (
                        <>
                          <span className={styles.originalPrice}>₹{Math.round(notes.original_price)}</span>
                          <span className={styles.discountedPrice}>₹{Math.round(notes.discounted_price)}</span>
                        </>
                      ) : (
                        <>₹{Math.round(notes.price || notes.discounted_price || 0)}</>
                      )}
                    </div>
                  </div>

                  <BuyNotesButton
                    notesId={notes.id}
                    price={notes.discounted_price || notes.price || 0}
                    title={notes.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
