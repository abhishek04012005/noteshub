'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './syllabuses.module.css';
import Loader from '../../../components/Loader';
import {
  Download as DownloadIcon,
  FilePresent,
  Search as SearchIcon,
  WarningOutlined as AlertIcon,
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

export default function SyllabusesPage() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [filteredSyllabuses, setFilteredSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [universities, setUniversities] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Fetch syllabuses
  useEffect(() => {
    fetchSyllabuses();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [syllabuses, searchQuery, filterUniversity, filterBranch, filterSemester]);

  const fetchSyllabuses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/syllabuses`);
      const data = response.data.data || [];
      setSyllabuses(data);

      // Extract unique values
      const uniqueUniversities = [...new Set(data.map((s: Syllabus) => s.university))].sort();
      const uniqueBranches = [...new Set(data.map((s: Syllabus) => s.branch))].sort();
      const uniqueSemesters = [...new Set(data.map((s: Syllabus) => s.semester))].sort();
      
      setUniversities(uniqueUniversities as string[]);
      setBranches(uniqueBranches as string[]);
      setSemesters(uniqueSemesters as string[]);
    } catch (error) {
      console.error('Error fetching syllabuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = syllabuses;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.author.toLowerCase().includes(query)
      );
    }

    // University filter
    if (filterUniversity) {
      filtered = filtered.filter((s) => s.university === filterUniversity);
    }

    // Branch filter
    if (filterBranch) {
      filtered = filtered.filter((s) => s.branch === filterBranch);
    }

    // Semester filter
    if (filterSemester) {
      filtered = filtered.filter((s) => s.semester === filterSemester);
    }

    setFilteredSyllabuses(filtered);
  };

  const handleDownload = async (downloadUrl: string, syllabusId: string) => {
    try {
      setDownloading(syllabusId);
      
      // Increment download count
      await axios.put(`/api/syllabuses?id=${syllabusId}&action=increment-downloads`);
      
      // Open download link
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error during download:', error);
      // Still allow download even if count increment fails
      window.open(downloadUrl, '_blank');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return <Loader message="Loading syllabuses..." size="large" fullScreen={true} />;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <FilePresent sx={{ fontSize: '2.5rem', marginRight: '1rem' }} style={{ display: 'inline' }} />
            Free Syllabuses
          </h1>
          <p className={styles.subtitle}>
            Download syllabuses from your university, branch, and semester
          </p>
        </div>
      </header>

      {/* Filters Section */}
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
              setFilterSemester('');
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

          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className={styles.resultsInfo}>
        <p>
          Found <span className={styles.resultCount}>{filteredSyllabuses.length}</span> of{' '}
          <span className={styles.totalCount}>{syllabuses.length}</span> syllabuses
        </p>
      </div>

      {/* Syllabuses Grid */}
      {filteredSyllabuses.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertIcon sx={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
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
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>University</span>
                  <span className={styles.metaValue}>{syllabus.university}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Branch</span>
                  <span className={styles.metaValue}>{syllabus.branch}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Semester</span>
                  <span className={styles.metaValue}>{syllabus.semester}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>By</span>
                  <span className={styles.metaValue}>{syllabus.author}</span>
                </div>
              </div>

              {/* Description */}
              <p className={styles.description}>{syllabus.description}</p>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Size</span>
                  <span className={styles.statValue}>{syllabus.file_size_mb.toFixed(2)} MB</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Downloads</span>
                  <span className={styles.statValue}>{syllabus.download_count}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Added</span>
                  <span className={styles.statValue}>
                    {new Date(syllabus.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(syllabus.download_url, syllabus.id)}
                disabled={downloading === syllabus.id}
                className={styles.downloadBtn}
              >
                <DownloadIcon sx={{ fontSize: '1rem' }} />
                {downloading === syllabus.id ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
