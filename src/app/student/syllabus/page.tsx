'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BreadcrumbSchema } from '@/components/SchemaOrg';
import { HeaderSection } from '@/components/landing/HeaderSection';
import { FooterSection } from '@/components/landing/FooterSection';
import { SITE_URL, getCanonical } from '@/config/site';
import { Search as SearchIcon, WarningOutlined as AlertIcon, FilterList, FilePresent } from '@mui/icons-material';
import styles from './page.module.css';
import SyllabusCard from '../../../components/SyllabusCard';

function slugify(value: string | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildSyllabusSlug(syllabus: { university?: string; course?: string; branch?: string; semester?: string; title?: string; id?: string }) {
  const parts = [slugify(syllabus.university), slugify(syllabus.course), slugify(syllabus.branch), slugify(syllabus.semester), slugify(syllabus.title)].filter(Boolean);
  return parts.length > 0 ? parts.join('-') : syllabus.id || 'syllabus';
}

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

export default function SyllabusPage() {
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

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [syllabuses, searchQuery, filterUniversity, filterCourse, filterBranch, filterSemester]);

  const fetchSyllabuses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/syllabuses');
      const data = response.data.data || [];
      setSyllabuses(data);

      const getUniqueValues = (values: (string | null | undefined)[]) =>
        Array.from(
          new Set(
            values
              .filter((v): v is string => Boolean(v))
              .map((v) => v.trim())
              .filter((v) => v.length > 0)
          )
        ).sort();

      setUniversities(getUniqueValues(data.map((s: Syllabus) => s.university)));
      setCourses(getUniqueValues(data.map((s: Syllabus) => s.course)));
      setBranches(getUniqueValues(data.map((s: Syllabus) => s.branch)));
      setSemesters(getUniqueValues(data.map((s: Syllabus) => s.semester)));
    } catch (error) {
      console.error('Error fetching syllabuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = syllabuses;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.author.toLowerCase().includes(query)
      );
    }

    if (filterUniversity) {
      filtered = filtered.filter((s) => s.university?.trim() === filterUniversity.trim());
    }

    if (filterCourse) {
      filtered = filtered.filter((s) => s.course?.trim() === filterCourse.trim());
    }

    if (filterBranch) {
      filtered = filtered.filter((s) => s.branch?.trim() === filterBranch.trim());
    }

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

  const handleDownload = (syllabusId: string) => {
    const currentSyllabus = syllabuses.find((item) => item.id === syllabusId);
    const slug = currentSyllabus ? buildSyllabusSlug(currentSyllabus) : syllabusId;
    setDownloading(syllabusId);
    window.location.href = `/student/syllabus-download/${slug}`;
  };

  return (
    <>
      <HeaderSection />
      <main className={styles.main}>
        <BreadcrumbSchema
          items={[{ name: 'Home', url: SITE_URL }, { name: 'Syllabuses', url: getCanonical('/student/syllabus') }]}
        />

        <section className={styles.heroPanel}>
          <div className={styles.heroWrapper}>
            <div className={styles.heroBody}>
              <div>
                <span className={styles.heroEyebrow}>Official syllabus downloads</span>
                <h1 className={styles.title}>
                  <span className={styles.heroIcon}>
                    <FilePresent sx={{ fontSize: '2.2rem' }} />
                  </span>
                  Syllabuses for your exams
                </h1>
                <p className={styles.subtitle}>
                  Download the latest approved syllabuses from your university, curated by branch and semester for quick access.
                </p>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.statLabel}>Syllabus library</span>
                <span className={styles.statValue}>{syllabuses.length} documents</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.filterSection}>
          <div className={styles.filterCard}>
            <div className={styles.filterRow}>
              <div className={styles.searchBar}>
                <SearchIcon sx={{ fontSize: '1.25rem', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  placeholder="Search by title, description, or author..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className={styles.filterToggleBtn} onClick={() => setShowFilters(!showFilters)}>
                <FilterList sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                {showFilters ? 'Hide filters' : 'Show filters'}
              </button>
            </div>

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
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        <div className={styles.content}>
          <div className={styles.contentContainer}>
            <div className={styles.resultsInfo}>
              <p>{`Showing ${filteredSyllabuses.length} of ${syllabuses.length} syllabuses.`}</p>
            </div>

            {loading ? (
              <div className={styles.syllabusesGrid}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={styles.skeletonCard}>
                    <div className={styles.skeletonTop}></div>
                    <div className={styles.skeletonBadgeRow}>
                      <span className={styles.skeletonBadge}></span>
                      <span className={styles.skeletonBadge}></span>
                    </div>
                    <div className={styles.skeletonLine}></div>
                    <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonAction}></div>
                  </div>
                ))}
              </div>
            ) : filteredSyllabuses.length === 0 ? (
              <div className={styles.emptyState}>
                <AlertIcon sx={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
                <h3>No syllabuses found</h3>
                <p>Try adjusting your search or filters to find the syllabus you need.</p>
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
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
