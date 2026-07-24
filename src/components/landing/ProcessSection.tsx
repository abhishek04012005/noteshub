import { Search, Payment, Download } from '@mui/icons-material';
import styles from './ProcessSection.module.css';

const steps = [
  { step: '01', icon: Search, title: 'Browse', desc: 'Explore curated notes and syllabus resources.' },
  { step: '02', icon: Payment, title: 'Purchase', desc: 'Pay securely in just a few clicks.' },
  { step: '03', icon: Download, title: 'Download', desc: 'Get instant access and start learning right away.' },
];

export function ProcessSection() {
  return (
    <section className={styles.process}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>How it works</p>
          <h2 className={styles.title}>Simple steps to your next study win</h2>
        </div>

        <div className={styles.grid}>
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={styles.card}>
                <div className={styles.step}>{item.step}</div>
                <div className={styles.iconWrap}>
                  <Icon sx={{ fontSize: '1.7rem', color: 'var(--primary)' }} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
