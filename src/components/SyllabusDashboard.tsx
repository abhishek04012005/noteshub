'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SyllabusDashboard.module.css';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  FilePresent,
  Search as SearchIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

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

export default function SyllabusDashboard() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [universities, setUniversities] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  // Fetch syllabuses
  useEffect(() => {
    fetchSyllabuses();
  }, [filterUniversity, filterBranch]);

  const fetchSyllabuses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterUniversity) params.append('university', filterUniversity);
      if (filterBranch) params.append('branch', filterBranch);

      const response = await axios.get(`/api/syllabuses?${params.toString()}`);
      const data = response.data.data || [];
      setSyllabuses(data);

      // Extract unique universities and branches
      const uniqueUniversities = [...new Set(data.map((s: Syllabus) => s.university))];
      const uniqueBranches = [...new Set(data.map((s: Syllabus) => s.branch))];
      setUniversities(uniqueUniversities as string[]);
      setBranches(uniqueBranches as string[]);
    } catch (error) {
      console.error('Error fetching syllabuses:', error);
      alert('Failed to fetch syllabuses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await axios.delete(`/api/syllabuses?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminEmail')}`,
        },
      });
      setSyllabuses(syllabuses.filter((s) => s.id !== id));
      alert('Syllabus deleted successfully');
    } catch (error) {
      console.error('Error deleting syllabus:', error);
      alert('Failed to delete syllabus');
    }
  };

  const handleDownload = async (downloadUrl: string, syllabusId: string) => {
    try {
      // Increment download count
      await axios.put(`/api/syllabuses?id=${syllabusId}&action=increment-downloads`);
      
      // Open download link
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error during download:', error);
      // Still allow download even if count increment fails
      window.open(downloadUrl, '_blank');
    }
  };

  const filteredSyllabuses = syllabuses.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.author.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading syllabuses...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <FilePresent sx={{ fontSize: '2rem', marginRight: '0.5rem' }} style={{ display: 'inline' }} />
            Syllabus Management
          </h1>
          <p className={styles.subtitle}>Manage free syllabuses for students</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBar}>
          <SearchIcon sx={{ fontSize: '1.2rem', color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search by title, description, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filterUniversity}
            onChange={(e) => {
              setFilterUniversity(e.target.value);
              setFilterBranch('');
            }}
            className={styles.filterSelect}
          >
            <option value="">All Universities</option>
            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>

          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className={styles.resultsInfo}>
        <p>
          Showing <span className={styles.resultCount}>{filteredSyllabuses.length}</span> of{' '}
          <span className={styles.totalCount}>{syllabuses.length}</span> syllabuses
        </p>
      </div>

      {/* Syllabuses List */}
      {filteredSyllabuses.length === 0 ? (
        <div className={styles.emptyState}>
          <InfoIcon sx={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3>No syllabuses found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={styles.syllabusesGrid}>
          {filteredSyllabuses.map((syllabus) => (
            <div key={syllabus.id} className={styles.syllabusCard}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{syllabus.title}</h3>
                <span className={styles.freeTag}>FREE</span>
              </div>

              {/* Metadata */}
              <div className={styles.metadata}>
                <div className={styles.metaItem}>
                  <span className={styles.label}>University:</span>
                  <span className={styles.value}>{syllabus.university}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.label}>Branch:</span>
                  <span className={styles.value}>{syllabus.branch}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.label}>Semester:</span>
                  <span className={styles.value}>{syllabus.semester}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.label}>Author:</span>
                  <span className={styles.value}>{syllabus.author}</span>
                </div>
              </div>

              {/* Description */}
              <p className={styles.description}>{syllabus.description}</p>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Size:</span>
                  <span className={styles.statValue}>{syllabus.file_size_mb.toFixed(2)} MB</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Downloads:</span>
                  <span className={styles.statValue}>{syllabus.download_count}</span>
                </div>
              </div>

              {/* Footer Date */}
              <div className={styles.footerDate}>
                {new Date(syllabus.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  onClick={() => handleDownload(syllabus.download_url, syllabus.id)}
                  className={styles.actionBtn}
                  title="Download"
                >
                  <DownloadIcon sx={{ fontSize: '1rem' }} />
                </button>
                <button
                  onClick={() => handleDelete(syllabus.id, syllabus.title)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  title="Delete"
                >
                  <DeleteIcon sx={{ fontSize: '1rem' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
