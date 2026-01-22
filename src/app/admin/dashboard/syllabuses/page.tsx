'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Add, DeleteOutline, FolderOff, Download, Edit, MenuBook } from '@mui/icons-material';
import AdminNavbar from '@/components/AdminNavbar';
import styles from './syllabuses.module.css';

interface Syllabus {
  id: string;
  file_name?: string;
  university: string;
  course: string;
  branch: string;
  semester: string;
  download_url: string;
  web_view_link?: string;
  file_size_mb?: number;
  created_at: string;
  title?: string;
}

export default function AdminSyllabusesPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    setIsAdmin(true);
    fetchSyllabuses();
  }, [router]);

  const fetchSyllabuses = async () => {
    try {
      const response = await axios.get('/api/syllabuses');
      console.log('📖 Fetched syllabuses:', response.data);
      setSyllabuses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching syllabuses:', error);
      setSyllabuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (syllabusId: string) => {
    if (!window.confirm('Are you sure you want to delete this syllabus?')) {
      return;
    }

    try {
      const adminEmail = localStorage.getItem('adminEmail');
      console.log('📝 Delete request:', { syllabusId, adminEmail });

      const response = await axios.delete(`/api/syllabuses/${syllabusId}`, {
        headers: {
          Authorization: `Bearer ${adminEmail}`,
        },
      });
      
      console.log('✅ Delete response:', response.data);
      setSyllabuses(syllabuses.filter((s) => s.id !== syllabusId));
      alert('Syllabus deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting syllabus:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete syllabus';
      alert(`Failed to delete: ${errorMsg}`);
    }
  };

  const handleDownloadSyllabus = async (syllabus: Syllabus) => {
    if (!syllabus.download_url) {
      alert('Download URL not available for this syllabus');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = syllabus.download_url;
      link.target = '_blank';
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading syllabus:', error);
      alert('Failed to download syllabus');
    }
  };

  if (!isAdmin) {
    return (
      <div className={styles.loadingState}>
        <p className={styles.loadingStateText}>Loading...</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <AdminNavbar />
      
      {/* Header */}
      <header className={styles.headerFixed}>
        <div className={styles.headerContainer}>
          <div className={styles.headerInfo}>
            <h1 className={styles.headerTitle}>
              <MenuBook sx={{ fontSize: '2rem', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--secondary)' }} />
              Syllabuses Dashboard
            </h1>
            <p className={styles.headerEmail}>
              {localStorage.getItem('adminEmail')}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/admin/dashboard/upload-syllabus" className={styles.uploadBtn}>
              <Add sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Upload Syllabus
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {/* Syllabuses Section */}
          <div className={styles.tableSection}>
            <h2 className={styles.sectionTitle}>
              <MenuBook sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--secondary)' }} />
              Your Uploaded Syllabuses
            </h2>

            {loading ? (
              <div className={styles.loadingContainer}>
                <p className={styles.loadingText}>Loading syllabuses...</p>
              </div>
            ) : syllabuses.length === 0 ? (
              <div className={styles.emptyState}>
                <FolderOff sx={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-light)' }} />
                <p className={styles.emptyMessage}>
                  No syllabuses uploaded yet. Start uploading your syllabuses now!
                </p>
                <Link href="/admin/dashboard/upload-syllabus" className={styles.emptyBtn}>
                  <Add sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                  Upload Your First Syllabus
                </Link>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeader}>File Name</th>
                      <th className={styles.tableHeader}>University</th>
                      <th className={styles.tableHeader}>Course</th>
                      <th className={styles.tableHeader}>Branch</th>
                      <th className={styles.tableHeader}>Semester</th>
                      <th className={styles.tableHeader}>Size</th>
                      <th className={styles.tableHeader}>Date</th>
                      <th className={styles.tableHeader}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {syllabuses.map((syllabus) => (
                      <tr key={syllabus.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <span className={styles.titleCell}>{syllabus.title || syllabus.file_name || 'Untitled'}</span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.universityBadge}>
                            {syllabus.university}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.courseBadge}>
                            {syllabus.course}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.branchBadge}>
                            {syllabus.branch}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.semesterBadge}>
                            {syllabus.semester}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.sizeCell}>
                            {syllabus.file_size_mb ? `${(syllabus.file_size_mb).toFixed(2)} MB` : 'N/A'}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.dateCell}>
                            {new Date(syllabus.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => handleDownloadSyllabus(syllabus)}
                              className={styles.downloadBtn}
                              title="Download syllabus"
                            >
                              <Download sx={{ fontSize: '1rem', marginRight: '0.25rem' }} />
                              Download
                            </button>
                            <button
                              onClick={() => router.push(`/admin/dashboard/edit-syllabus/${syllabus.id}`)}
                              className={styles.editBtn}
                            >
                              <Edit sx={{ fontSize: '1rem', marginRight: '0.25rem' }} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(syllabus.id)}
                              className={styles.deleteBtn}
                            >
                              <DeleteOutline sx={{ fontSize: '1rem', marginRight: '0.25rem' }} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
