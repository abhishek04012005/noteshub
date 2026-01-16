'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Notes } from '@/types';
import BuyNotesButton from '@/components/BuyNotesButton';
import Link from 'next/link';
import styles from './notes.module.css';
import { SentimentDissatisfied, MenuBook, Apartment, LibraryBooks, SchoolOutlined, CalendarToday } from '@mui/icons-material';

export default function NotesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [notes, setNotes] = useState<Notes | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
    });
  }, [params]);

  useEffect(() => {
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
  }, [id]);

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
          <SentimentDissatisfied sx={{ fontSize: 48, color: '#F4A261' }} />
          <p className={styles.errorMessage}>Notes not found</p>
          <Link href="/student/browse" className={styles.errorLink}>
            ← Back to Browse
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
            ← Back to Browse
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
                    <MenuBook sx={{ fontSize: 48, color: '#F4A261' }} />
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
                        <span className={styles.keyDetailLabelIcon}><Apartment sx={{ fontSize: 18 }} /></span>
                        <p className={styles.keyDetailLabel}>University</p>
                        <p className={styles.keyDetailValue}>{notes.university}</p>
                      </div>
                    )}
                    {notes.course && (
                      <div className={styles.keyDetailItem}>
                        <span className={styles.keyDetailLabelIcon}><LibraryBooks sx={{ fontSize: 18 }} /></span>
                        <p className={styles.keyDetailLabel}>Course</p>
                        <p className={styles.keyDetailValue}>{notes.course}</p>
                      </div>
                    )}
                    {notes.branch && (
                      <div className={styles.keyDetailItem}>
                        <span className={styles.keyDetailLabelIcon}><SchoolOutlined sx={{ fontSize: 18 }} /></span>
                        <p className={styles.keyDetailLabel}>Branch</p>
                        <p className={styles.keyDetailValue}>{notes.branch}</p>
                      </div>
                    )}
                    {notes.semester && (
                      <div className={styles.keyDetailItem}>
                        <span className={styles.keyDetailLabelIcon}><CalendarToday sx={{ fontSize: 18 }} /></span>
                        <p className={styles.keyDetailLabel}>Semester</p>
                        <p className={styles.keyDetailValue}>{notes.semester}</p>
                      </div>
                    )}
                    {notes.chapter_no && (
                      <div className={styles.keyDetailItem}>
                        <span className={styles.keyDetailLabelIcon}><MenuBook sx={{ fontSize: 18 }} /></span>
                        <p className={styles.keyDetailLabel}>Chapter</p>
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
