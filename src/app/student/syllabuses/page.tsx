'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './syllabuses.module.css';
import Loader from '../../../components/Loader';
import SyllabusCard from '../../../components/SyllabusCard';
import Link from 'next/link';
import {
  Search as SearchIcon,
  WarningOutlined as AlertIcon,
  FilterList,
  ArrowBack,
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
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
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
  }, [syllabuses, searchQuery, filterUniversity, filterCourse, filterBranch, filterSemester]);

  const fetchSyllabuses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/syllabuses`);
      const data = response.data.data || [];
      setSyllabuses(data);

      // Helper function to extract and deduplicate values
      const getUniqueValues = (values: (string | null | undefined)[]) => {
        return Array.from(
          new Set(
            values
              .filter((v): v is string => Boolean(v))
              .map(v => v.trim())
              .filter(v => v.length > 0)
          )
        ).sort();
      };

      // Extract unique values
      const uniqueUniversities = getUniqueValues(data.map((s: Syllabus) => s.university));
      const uniqueCourses = getUniqueValues(data.map((s: Syllabus) => s.course));
      const uniqueBranches = getUniqueValues(data.map((s: Syllabus) => s.branch));
      const uniqueSemesters = getUniqueValues(data.map((s: Syllabus) => s.semester));
      
      setUniversities(uniqueUniversities);
      setCourses(uniqueCourses);
      setBranches(uniqueBranches);
      setSemesters(uniqueSemesters);
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
      filtered = filtered.filter((s) => s.university?.trim() === filterUniversity.trim());
    }

    // Course filter
    if (filterCourse) {
      filtered = filtered.filter((s) => s.course?.trim() === filterCourse.trim());
    }

    // Branch filter
    if (filterBranch) {
      filtered = filtered.filter((s) => s.branch?.trim() === filterBranch.trim());
    }

    // Semester filter
    if (filterSemester) {
      filtered = filtered.filter((s) => s.semester?.trim() === filterSemester.trim());
    }

    setFilteredSyllabuses(filtered);
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilterUniversity('');
    setFilterCourse('');
    setFilterBranch('');
    setFilterSemester('');
  };

  const handleDownload = async (syllabusId: string) => {
    try {
      setDownloading(syllabusId);
      // Navigate to download form page
      window.location.href = `/student/syllabus-download/${syllabusId}`;
    } catch (error) {
      console.error('Error during download:', error);
      setDownloading(null);
    }
  };

  if (loading) {
    return <Loader message="Loading syllabuses..." size="large" fullScreen={true} />;
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.backLink}>
            <ArrowBack sx={{ fontSize: '1rem' }} />
            Back Home
          </Link>
          <h1 className={styles.title}>Browse All Syllabuses</h1>
          <p className={styles.subtitle}>Explore our collection of quality study materials</p>
        </div>
      </header>

      {/* Search and Filters Section */}
      <section className={styles.filterSection}>
        <div className={styles.filterControls}>
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <SearchIcon sx={{ fontSize: '1.25rem' }} />
            <input
              type="text"
              placeholder="Search by title, university, or branch..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            className={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterList sx={{ fontSize: '1rem' }} />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>University</label>
              <select
                className={styles.filterSelect}
                value={filterUniversity}
                onChange={(e) => setFilterUniversity(e.target.value)}
              >
                <option value="">All Universities</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Course</label>
              <select
                className={styles.filterSelect}
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Branch</label>
              <select
                className={styles.filterSelect}
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Semester</label>
              <select
                className={styles.filterSelect}
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <button className={styles.resetBtn} onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        Found <span className={styles.resultCount}>{filteredSyllabuses.length}</span> syllabuses
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
            <SyllabusCard
              key={syllabus.id}
              syllabus={syllabus}
              downloading={downloading === syllabus.id}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </main>
  );
}
