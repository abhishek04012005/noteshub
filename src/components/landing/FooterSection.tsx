import Link from 'next/link';
import styles from './FooterSection.module.css';

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <h4 className={styles.title}>Platform</h4>
            <ul className={styles.list}>
              <li><Link href="/" className={styles.link}>Home</Link></li>
              <li><Link href="/student/browse" className={styles.link}>Browse notes</Link></li>
              <li><Link href="/student/syllabus" className={styles.link}>Browse syllabuses</Link></li>
              <li><Link href="/admin/login" className={styles.link}>Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.title}>Contact</h4>
            <ul className={styles.list}>
              <li><a href="mailto:notesmarketplace07@gmail.com" className={styles.link}>notesmarketplace07@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} NotesHub. All rights reserved.</p>
          <p>Made with care for ambitious learners.</p>
        </div>
      </div>
    </footer>
  );
}
