'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './syllabus-downloads.module.css';
import Loader from '../../../../components/Loader';
import Link from 'next/link';
import {
  Download,
  ArrowBack,
  Email,
  Person,
  DateRange,
  FileDownload,
  BarChart,
  Info,
  Close,
} from '@mui/icons-material';

interface Download {
  id: string;
  syllabus_id: string;
  student_name: string;
  student_email: string;
  created_at: string;
  syllabuses?: {
    id: string;
    title: string;
    university: string;
    course: string;
    branch: string;
    semester: string;
  };
}

interface Stats {
  totalDownloads: number;
  uniqueStudents: number;
  todayDownloads: number;
  thisMonthDownloads: number;
}

export default function SyllabusDownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalDownloads: 0,
    uniqueStudents: 0,
    todayDownloads: 0,
    thisMonthDownloads: 0,
  });
  const [filteredDownloads, setFilteredDownloads] = useState<Download[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedSyllabus, setSelectedSyllabus] = useState<Download | null>(null);

  const itemsPerPage = 15;

  useEffect(() => {
    fetchDownloads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [downloads, searchQuery, sortBy]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const adminEmail = localStorage.getItem('adminEmail') || 'admin';

      const response = await axios.get('/api/syllabuses/downloads', {
        headers: { Authorization: `Bearer ${adminEmail}` },
      });

      const data = response.data.data || [];
      setDownloads(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Download[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayCount = data.filter(
      d => new Date(d.created_at) >= today
    ).length;

    const monthCount = data.filter(
      d => new Date(d.created_at) >= monthStart
    ).length;

    const uniqueEmails = new Set(data.map(d => d.student_email)).size;

    setStats({
      totalDownloads: data.length,
      uniqueStudents: uniqueEmails,
      todayDownloads: todayCount,
      thisMonthDownloads: monthCount,
    });
  };

  const applyFilters = () => {
    let filtered = [...downloads];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.student_name.toLowerCase().includes(query) ||
          d.student_email.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredDownloads(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredDownloads.length / itemsPerPage);
  const paginatedDownloads = filteredDownloads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Downloaded At'];
    const csvContent = [
      headers.join(','),
      ...downloads.map(d =>
        `"${d.student_name}","${d.student_email}","${new Date(d.created_at).toLocaleString('en-IN')}"`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syllabus-downloads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return <Loader message="Loading download analytics..." size="large" fullScreen={true} />;
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/admin/dashboard" className={styles.backLink}>
            <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Dashboard
          </Link>
          <h1 className={styles.title}>
            <Download sx={{ fontSize: '1.75rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Syllabus Downloads Analytics
          </h1>
          <p className={styles.subtitle}>
            View and analyze who downloaded syllabuses from your platform
          </p>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FileDownload sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Total Downloads</p>
                <p className={styles.statValue}>{stats.totalDownloads}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Person sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Unique Students</p>
                <p className={styles.statValue}>{stats.uniqueStudents}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <DateRange sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Today Downloads</p>
                <p className={styles.statValue}>{stats.todayDownloads}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <BarChart sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>This Month</p>
                <p className={styles.statValue}>{stats.thisMonthDownloads}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.controlsRight}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className={styles.sortSelect}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <button onClick={exportToCSV} className={styles.exportBtn}>
                Export CSV
              </button>
            </div>
          </div>

          {/* Downloads Table */}
          <div className={styles.tableSection}>
            {filteredDownloads.length === 0 ? (
              <div className={styles.emptyState}>
                <Download sx={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
                <h3>No downloads yet</h3>
                <p>Syllabus downloads will appear here once students start downloading</p>
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead className={styles.tableHead}>
                      <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Downloaded At</th>
                        <th>Action</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                      {paginatedDownloads.map((download, index) => (
                        <tr key={download.id} className={index % 2 === 0 ? styles.rowAlternate : ''}>
                          
                          <td>
                            <div className={styles.nameCell}>
                              <Person sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                              {download.student_name}
                            </div>
                          </td>
                          <td>
                            <div className={styles.emailCell}>
                              <Email sx={{ fontSize: '0.9rem', marginRight: '0.5rem' }} />
                              {download.student_email}
                            </div>
                          </td>
                          <td>
                            {new Date(download.created_at).toLocaleString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td>
                            <button
                              className={styles.infoButton}
                              onClick={() => setSelectedSyllabus(download)}
                              title="View syllabus details"
                            >
                              <Info sx={{ fontSize: '1.25rem' }} />
                            </button>
                          </td>
                          <td>
                            <span className={styles.badge}>Completed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={styles.paginationBtn}
                    >
                      Previous
                    </button>

                    <div className={styles.pageInfo}>
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={styles.paginationBtn}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Syllabus Details Modal */}
          {selectedSyllabus && selectedSyllabus.syllabuses && (
            <div className={styles.modalOverlay} onClick={() => setSelectedSyllabus(null)}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>Syllabus Details</h2>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setSelectedSyllabus(null)}
                    title="Close"
                  >
                    <Close sx={{ fontSize: '1.5rem' }} />
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Title:</span>
                    <span className={styles.detailValue}>{selectedSyllabus.syllabuses.title}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>University:</span>
                    <span className={styles.detailValue}>{selectedSyllabus.syllabuses.university}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Course:</span>
                    <span className={styles.detailValue}>{selectedSyllabus.syllabuses.course}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Branch:</span>
                    <span className={styles.detailValue}>{selectedSyllabus.syllabuses.branch}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Semester:</span>
                    <span className={styles.detailValue}>{selectedSyllabus.syllabuses.semester}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Downloaded By:</span>
                    <span className={styles.detailValue}>{selectedSyllabus.student_name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>{selectedSyllabus.student_email}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Downloaded At:</span>
                    <span className={styles.detailValue}>
                      {new Date(selectedSyllabus.created_at).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
