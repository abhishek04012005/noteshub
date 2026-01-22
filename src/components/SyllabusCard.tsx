'use client';

import { FilePresent, Download as DownloadIcon } from '@mui/icons-material';
import styles from './SyllabusCard.module.css';

interface Syllabus {
  id: string;
  university: string;
  course: string;
  branch: string;
  semester: string;
  title: string;
  description: string;
  author: string;
  download_url: string;
  file_size_mb: number;
  download_count: number;
  created_at: string;
}

interface SyllabusCardProps {
  syllabus: Syllabus;
  downloading?: boolean;
  onDownload: (syllabusId: string) => void;
}

export default function SyllabusCard({ syllabus, downloading, onDownload }: SyllabusCardProps) {
  return (
    <div className={styles.card}>
      {/* Image Placeholder with Gradient */}
      <div className={styles.imageContainer}>
        <FilePresent sx={{ fontSize: '2.5rem', color: 'white' }} />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Metadata Badges */}
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{syllabus.university}</span>
          <span className={styles.badge}>{syllabus.course}</span>
          <span className={styles.badge}>{syllabus.branch}</span>
          <span className={styles.badge}>Sem {syllabus.semester}</span>
        </div>

        {/* Title */}
        <h3 className={styles.title}>{syllabus.title}</h3>

        {/* Description */}
        <p className={styles.description}>{syllabus.description}</p>

        {/* Footer Section */}
        <div className={styles.footer}>
          
          <button
            onClick={() => onDownload(syllabus.id)}
            disabled={downloading}
            className={styles.downloadBtn}
          >
            <DownloadIcon sx={{ fontSize: '0.875rem' }} />
            {downloading ? 'Processing...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
