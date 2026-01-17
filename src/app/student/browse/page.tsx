'use client';

import { NotesList } from '@/components/NotesCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './browse.module.css';
import { ArrowBack, Search, FilterList } from '@mui/icons-material';
import { Notes } from '@/types';

export default function BrowseNotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Dropdown options state
  const [universities, setUniversities] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Fetch unique values for dropdowns
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('/api/notes');
        const notes: Notes[] = response.data.data || [];

        // Extract unique values
        const uniqueUniversities = Array.from(
          new Set(notes.map(n => n.university).filter(Boolean))
        ).sort() as string[];
        
        const uniqueCourses = Array.from(
          new Set(notes.map(n => n.course).filter(Boolean))
        ).sort() as string[];
        
        const uniqueBranches = Array.from(
          new Set(notes.map(n => n.branch).filter(Boolean))
        ).sort() as string[];
        
        const uniqueSemesters = Array.from(
          new Set(notes.map(n => n.semester).filter(Boolean))
        ).sort() as string[];
        
        const uniqueSubjects = Array.from(
          new Set(notes.map(n => n.subject).filter(Boolean))
        ).sort() as string[];

        setUniversities(uniqueUniversities);
        setCourses(uniqueCourses);
        setBranches(uniqueBranches);
        setSemesters(uniqueSemesters);
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleReset = () => {
    setSearchQuery('');
    setFilterUniversity('');
    setFilterCourse('');
    setFilterBranch('');
    setFilterSemester('');
    setFilterSubject('');
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.backLink}>
            <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Back Home
          </Link>
          <h1 className={styles.title}>
            Browse All Notes
          </h1>
          <p className={styles.subtitle}>
            Explore our collection of quality study materials
          </p>
        </div>
      </header>

      {/* Search and Filters Section */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <Search sx={{ fontSize: '1.25rem', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search by title, subject, or author..."
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
            <FilterList sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
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
                disabled={loadingOptions}
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
                disabled={loadingOptions}
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
                disabled={loadingOptions}
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
                disabled={loadingOptions}
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Subject</label>
              <select
                className={styles.filterSelect}
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                disabled={loadingOptions}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
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

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <NotesList 
            searchQuery={searchQuery}
            filterUniversity={filterUniversity}
            filterCourse={filterCourse}
            filterBranch={filterBranch}
            filterSemester={filterSemester}
            filterSubject={filterSubject}
          />
        </div>
      </div>
    </main>
  );
}
