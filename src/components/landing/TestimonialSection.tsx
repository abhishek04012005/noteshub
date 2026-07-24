import Link from 'next/link';
import { Star } from '@mui/icons-material';
import styles from './TestimonialSection.module.css';

export function TestimonialSection() {
  return (
    <section className={styles.testimonial}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <Star key={index} sx={{ fontSize: '1.4rem', color: 'var(--secondary)' }} />
            ))}
          </div>
          <h2 className={styles.title}>Join thousands of students already improving their grades</h2>
          <p className={styles.description}>
            From quick revision to deep understanding, our collection keeps your preparation simple and effective.
          </p>
          <Link href="/student/browse" className={styles.btn}>
            Start your journey
          </Link>
        </div>
      </div>
    </section>
  );
}
