import Link from 'next/link';
import { NotesList } from '@/components/NotesCard';
import { ArrowForward, Star } from '@mui/icons-material';
import styles from './FeaturedNotesSection.module.css';

export function FeaturedNotesSection() {
  return (
    <section className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}><Star sx={{ fontSize: '1rem', color: 'var(--secondary)' }} /> Trending now</p>
            <h2 className={styles.title}>Most downloaded notes</h2>
          </div>
          <Link href="/student/browse" className={styles.viewAll}>
            View all <ArrowForward sx={{ fontSize: '1rem' }} />
          </Link>
        </div>

        <NotesList featured />

        <div className={styles.ctaRow}>
          <Link href="/student/browse" className={styles.primaryBtn}>
            Explore the full library
          </Link>
        </div>
      </div>
    </section>
  );
}
