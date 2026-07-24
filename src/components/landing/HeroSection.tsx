import Link from 'next/link';
import { Star, Lock, School, VerifiedUser } from '@mui/icons-material';
import styles from './HeroSection.module.css';

const trustItems = [
  { icon: Lock, label: 'Secure payments' },
  { icon: School, label: 'Verified experts' },
  { icon: VerifiedUser, label: 'Trusted by students' },
];

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroGlowAlt} />
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Star sx={{ fontSize: '1rem', color: 'var(--secondary)' }} />
            <span>Trusted by 1000+ students • 4.8★ average rating</span>
          </div>

          <h1 className={styles.title}>
            Study smarter with <span>expert notes</span>
          </h1>

          <p className={styles.description}>
            Discover premium notes, syllabus resources, and instant downloads designed to help you learn faster and perform better.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/student/browse" className={styles.primaryBtn}>
              Download Notes
            </Link>
            <Link href="/student/syllabus" className={styles.secondaryBtn}>
              Browse Syllabus
            </Link>
          </div>

          <div className={styles.trustRow}>
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={styles.trustItem}>
                  <Icon sx={{ fontSize: '1rem', color: 'var(--secondary)' }} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
