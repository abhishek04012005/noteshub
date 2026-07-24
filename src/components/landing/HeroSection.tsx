import Link from 'next/link';
import {
  AutoStories,
  ShieldOutlined,
  VerifiedOutlined,
  DownloadOutlined,
  MenuBookOutlined,
  FlashOnOutlined,
  Star,
  SchoolOutlined,
  LibraryBooksOutlined,
  TipsAndUpdatesOutlined,
  DescriptionOutlined,
} from '@mui/icons-material';
import styles from './HeroSection.module.css';

const highlights = [
  { icon: ShieldOutlined, title: 'Safe & secure', desc: 'Trusted downloads and protected payments.' },
  { icon: VerifiedOutlined, title: 'Verified content', desc: 'Curated by top-performing students and educators.' },
  { icon: FlashOnOutlined, title: 'Instant access', desc: 'Get your notes ready in seconds after purchase.' },
];

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroGlowAlt} />
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Star sx={{ fontSize: '1rem', color: 'var(--primary)' }} />
            <span>Trusted by 1000+ students • 4.8★ average rating</span>
          </div>

          <h1 className={styles.title}>
            Study better with <span>expert notes</span> and smart resources
          </h1>

          <p className={styles.description}>
            Find premium handwritten notes, syllabus guides, and exam-ready materials designed to help you learn faster and score higher.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/student/browse" className={styles.primaryBtn}>
              <DownloadOutlined sx={{ fontSize: '1.1rem' }} />
              Download Notes
            </Link>
            <Link href="/student/syllabus" className={styles.secondaryBtn}>
              <MenuBookOutlined sx={{ fontSize: '1.1rem' }} />
              Browse Syllabus
            </Link>
          </div>

          <div className={styles.highlightGrid}>
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    <Icon sx={{ fontSize: '1.2rem', color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualCard}>
            <div className={styles.visualTop}>
              <AutoStories sx={{ fontSize: '2rem', color: 'var(--primary)' }} />
              <span>Ready to learn</span>
            </div>

            <div className={styles.iconGrid}>
              <div className={styles.iconTile}><SchoolOutlined sx={{ fontSize: '1.6rem' }} /></div>
              <div className={styles.iconTile}><LibraryBooksOutlined sx={{ fontSize: '1.6rem' }} /></div>
              <div className={styles.iconTile}><DescriptionOutlined sx={{ fontSize: '1.6rem' }} /></div>
              <div className={styles.iconTile}><TipsAndUpdatesOutlined sx={{ fontSize: '1.6rem' }} /></div>
            </div>

            <div className={styles.visualStats}>
              <div>
                <strong>100+</strong>
                <p>Study packs</p>
              </div>
              <div>
                <strong>24/7</strong>
                <p>Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
