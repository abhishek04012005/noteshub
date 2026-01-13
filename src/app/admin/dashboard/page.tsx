'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { MenuBook, Add, TrendingUp, DeleteOutline, FolderOff, EditOutlined } from '@mui/icons-material';
import { Notes } from '@/types';
import styles from './dashboard.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsAdmin(true);
    fetchNotes();
  }, [router]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    router.push('/admin/login');
  };

  const handleDelete = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await axios.delete(`/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setNotes(notes.filter((n) => n.id !== noteId));
      alert('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
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
      {/* Header */}
      <header className={styles.headerFixed}>
        <div className={styles.headerContainer}>
          <div className={styles.headerInfo}>
            <h1 className={styles.headerTitle}>
              <MenuBook sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Notes Dashboard
            </h1>
            <p className={styles.headerEmail}>
              {localStorage.getItem('adminEmail')}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/admin/dashboard/upload" className={styles.uploadBtn}>
              <Add sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Upload Notes
            </Link>
            <Link href="/admin/dashboard/sales" className={styles.salesBtn}>
              <TrendingUp sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              View Sales
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {/* Notes Table Section */}
          <div className={styles.tableSection}>
            <h2 className={styles.sectionTitle}>
              <MenuBook sx={{ fontSize: '1.25rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Your Uploaded Notes
            </h2>

            {loading ? (
              <div className={styles.loadingContainer}>
                <p className={styles.loadingText}>Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className={styles.emptyState}>
                <FolderOff sx={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-light)' }} />
                <p className={styles.emptyMessage}>
                  No notes uploaded yet. Start uploading your notes now!
                </p>
                <Link href="/admin/dashboard/upload" className={styles.emptyBtn}>
                  <Add sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                  Upload Your First Notes
                </Link>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeader}>Title</th>
                      <th className={styles.tableHeader}>Subject</th>
                      <th className={styles.tableHeader}>Price</th>
                      <th className={styles.tableHeader}>Author</th>
                      <th className={styles.tableHeader}>Date</th>
                      <th className={styles.tableHeader}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {notes.map((note) => (
                      <tr key={note.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <span className={styles.titleCell}>{note.title}</span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.subjectBadge}>
                            {note.subject}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.priceCell}>
                            ₹{(note.discounted_price || note.price || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.authorCell}>
                            {note.author}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.dateCell}>
                            {new Date(note.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => router.push(`/admin/dashboard/edit/${note.id}`)}
                              className={styles.editBtn}
                            >
                              <EditOutlined sx={{ fontSize: '1rem', marginRight: '0.25rem' }} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(note.id)}
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
