import Link from 'next/link';
import styles from './FinalCTASection.module.css';

export function FinalCTASection() {
  return (
    <section className={styles.finalCta}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Ready to level up your studies?</h2>
          <p className={styles.description}>Start exploring curated study materials and make your next exam prep easier.</p>
          <Link href="/student/browse" className={styles.btn}>
            Browse now
          </Link>
        </div>
      </div>
    </section>
  );
}
