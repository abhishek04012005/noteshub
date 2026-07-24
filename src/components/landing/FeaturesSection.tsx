import { Lock, School, PhoneIphone, TrendingUp } from '@mui/icons-material';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: Lock,
    title: 'Secure & safe',
    desc: 'Protected payments and trusted downloads for every student.',
  },
  {
    icon: School,
    title: 'Verified experts',
    desc: 'Every resource comes from curated educators and top performers.',
  },
  {
    icon: PhoneIphone,
    title: 'Mobile ready',
    desc: 'Perfect for learning anywhere, on any device, at any time.',
  },
  {
    icon: TrendingUp,
    title: 'Affordable pricing',
    desc: 'High-quality content that fits your budget and study goals.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Why students choose us</p>
          <h2 className={styles.title}>Everything you need for confident studying</h2>
          <p className={styles.subtitle}>A clean experience from discovery to download, built around your academic success.</p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={styles.card}>
                <div className={styles.iconWrap}>
                  <Icon sx={{ fontSize: '1.7rem', color: 'var(--primary)' }} />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
