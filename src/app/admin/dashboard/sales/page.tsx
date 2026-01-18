'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  ArrowBack,
  BarChart,
  AttachMoney,
  FolderOff,
  Logout,
  Info,
  Close,
  Refresh,
  Download,
} from '@mui/icons-material';
import { Purchase } from '@/types';
import styles from './sales.module.css';

export default function AdminSalesPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Purchase | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    setIsAdmin(true);
    fetchSalesData();

    // Auto-refresh sales data every 10 seconds to show latest downloads
    const interval = setInterval(fetchSalesData, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('/api/admin/purchases');
      const data = response.data.data || [];
      setPurchases(data);
      
      // Count only completed payments for total sales
      const completedSales = data.filter((p: Purchase) => p.status === 'completed');
      setTotalSales(completedSales.length);
      
      // Calculate revenue only from completed payments (excluding cancelled)
      const revenue = completedSales.reduce((sum: number, purchase: Purchase) => sum + (purchase.amount || 0), 0);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchSalesData();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminId');
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  const handleStatusChange = async (newStatus: 'pending' | 'completed' | 'failed' | 'cancelled') => {
    if (!selectedNote) return;
    
    setIsUpdatingStatus(true);
    try {
      const response = await axios.put('/api/admin/purchases', {
        purchaseId: selectedNote.id,
        status: newStatus,
      });
      
      if (response.data.success) {
        // Update the local state
        const updatedPurchases = purchases.map(p => 
          p.id === selectedNote.id ? { ...p, status: newStatus } : p
        );
        setPurchases(updatedPurchases);
        setSelectedNote({ ...selectedNote, status: newStatus });
        
        // Recalculate stats
        const completedSales = updatedPurchases.filter((p: Purchase) => p.status?.toLowerCase() === 'completed');
        setTotalSales(completedSales.length);
        const revenue = completedSales.reduce((sum: number, purchase: Purchase) => sum + (purchase.amount || 0), 0);
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadNotes = async (purchase: Purchase) => {
    if (!purchase.download_url) {
      alert('Download URL not available');
      return;
    }

    try {
      setIsUpdatingStatus(true);

      // Open the download URL
      const link = document.createElement('a');
      link.href = purchase.download_url;
      link.target = '_blank';
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Mark as downloaded in database
      try {
        const response = await axios.put('/api/admin/purchases', {
          purchaseId: purchase.id,
          markDownloaded: true,
        });

        if (response.data.success && response.data.data) {
          const updatedRecord = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
          
          if (updatedRecord) {
            // Update local state with the new data
            const updatedPurchases = purchases.map(p => 
              p.id === purchase.id ? { ...p, ...updatedRecord } : p
            );
            setPurchases(updatedPurchases);
            
            // Update selected note if it's open
            if (selectedNote && selectedNote.id === purchase.id) {
              setSelectedNote({ ...selectedNote, ...updatedRecord });
            }
          }
        }
      } catch (dbError) {
        console.error('Error recording download:', dbError);
        // Still allow download even if marking fails
      }
    } catch (error) {
      console.error('Error downloading notes:', error);
      alert('Failed to download notes');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadStatusToggle = async (newDownloadStatus: boolean) => {
    if (!selectedNote) return;
    
    setIsUpdatingStatus(true);
    try {
      const response = await axios.put('/api/admin/purchases', {
        purchaseId: selectedNote.id,
        markDownloaded: newDownloadStatus,
      });
      
      if (response.data.success && response.data.data) {
        const updatedRecord = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        
        if (updatedRecord) {
          // Update local state with the new data
          const updatedPurchases = purchases.map(p => 
            p.id === selectedNote.id ? { ...p, ...updatedRecord } : p
          );
          setPurchases(updatedPurchases);
          setSelectedNote({ ...selectedNote, ...updatedRecord });
        }
      }
    } catch (error) {
      console.error('Error updating download status:', error);
      alert('Failed to update download status');
    } finally {
      setIsUpdatingStatus(false);
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
              <TrendingUp sx={{ fontSize: '1.5rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Sales Analytics
            </h1>
            <p className={styles.headerEmail}>Track your earnings and sales performance</p>
          </div>

          <div className={styles.headerActions}>
            <button
              onClick={handleManualRefresh}
              className={styles.navBtn}
              disabled={refreshing}
              title="Refresh data"
              style={{ opacity: refreshing ? 0.6 : 1 }}
            >
              <Refresh sx={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => router.back()}
              className={styles.navBtn}
              title="Go back"
            >
              <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Back
            </button>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <Logout sx={{ fontSize: '1rem', marginRight: '0.25rem' }} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div style={{  padding: '2rem 1rem' }}>
        <section className={styles.statsSection}>
          {/* Total Sales Card */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BarChart sx={{ fontSize: '2rem', color: 'var(--primary-600)' }} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Sales</p>
              <p className={styles.statValue}>{totalSales}</p>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <AttachMoney sx={{ fontSize: '2rem', color: 'var(--success-600)' }} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Revenue</p>
              <p className={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </section>

        {/* Sales Table Section */}
        <section className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Recent Purchases</h2>
          
          {loading ? (
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>Loading sales data...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className={styles.emptyState}>
              <FolderOff className={styles.emptyIcon} sx={{ fontSize: '3rem' }} />
              <p className={styles.emptyMessage}>No sales yet</p>
              <p className={styles.emptyMessage} style={{ fontSize: '0.875rem', opacity: 0.7 }}>Your sales will appear here once someone purchases your notes</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeader}>Date</th>
                    <th className={styles.tableHeader}>Customer Name</th>
                    <th className={styles.tableHeader}>Email</th>
                    <th className={styles.tableHeader}>Amount</th>
                    <th className={styles.tableHeader}>Payment ID</th>
                    <th className={styles.tableHeader}>Note Details</th>
                    <th className={styles.tableHeader}>Download</th>
                    <th className={styles.tableHeader}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => {
                    // Determine display status
                    const normalizedStatus = purchase.status?.toLowerCase() || 'pending';
                    let displayStatus = purchase.status?.charAt(0).toUpperCase() + purchase.status?.slice(1).toLowerCase() || 'Pending';
                    let statusClass = displayStatus;
                    
                    // Check if payment is completed but notes not downloaded
                    if (normalizedStatus === 'completed' && !purchase.download_url) {
                      displayStatus = 'Completed - Not Downloaded';
                      statusClass = 'CompletedNotDownloaded';
                    }
                    
                    return (
                      <tr key={purchase.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{new Date(purchase.created_at).toLocaleDateString()}</td>
                        <td className={`${styles.tableCell} ${styles.nameCell}`}>{purchase.customer_name || 'N/A'}</td>
                        <td className={`${styles.tableCell} ${styles.emailCell}`}>{purchase.customer_email || purchase.email || 'N/A'}</td>
                        <td className={`${styles.tableCell} ${styles.amountCell}`}>₹{purchase.amount?.toLocaleString('en-IN') || '0'}</td>
                        <td className={`${styles.tableCell} ${styles.transactionId}`}>{purchase.razorpay_payment_id?.substring(0, 12)}...</td>
                        <td className={styles.tableCell}>
                          <button 
                            className={styles.infoButton}
                            onClick={() => setSelectedNote(purchase)}
                            title="View note details"
                          >
                            <Info sx={{ fontSize: '1.25rem' }} />
                          </button>
                        </td>
                        <td className={styles.tableCell}>
                          <button 
                            className={styles.downloadTableBtn}
                            onClick={() => handleDownloadNotes(purchase)}
                            disabled={!purchase.download_url}
                            title={purchase.download_url ? 'Download notes' : 'Download URL not available'}
                          >
                            <Download sx={{ fontSize: '1.25rem' }} />
                          </button>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={`${styles.statusBadge} ${styles[`status${statusClass}`]}`}>
                            {displayStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Note Details Modal */}
      {selectedNote && selectedNote.notes && (
        <div className={styles.modalOverlay} onClick={() => setSelectedNote(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Note Details</h2>
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setSelectedNote(null)}
                title="Close"
              >
                <Close sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>
            
            <div className={styles.modalContent}>
              {selectedNote.notes.title && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Title:</span>
                  <span className={styles.detailValue}>{selectedNote.notes.title}</span>
                </div>
              )}
              {selectedNote.notes.university && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>University:</span>
                  <span className={styles.detailValue}>{selectedNote.notes.university}</span>
                </div>
              )}
              {selectedNote.notes.course && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Course:</span>
                  <span className={styles.detailValue}>{selectedNote.notes.course}</span>
                </div>
              )}
              {selectedNote.notes.branch && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Branch:</span>
                  <span className={styles.detailValue}>{selectedNote.notes.branch}</span>
                </div>
              )}
              {selectedNote.notes.semester && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Semester:</span>
                  <span className={styles.detailValue}>{selectedNote.notes.semester}</span>
                </div>
              )}
              {selectedNote.notes.subject && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Subject:</span>
                  <span className={styles.detailValue}>{selectedNote.notes.subject}</span>
                </div>
              )}
              {selectedNote.notes.chapter_no && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Chapter:</span>
                  <span className={styles.detailValue}>{selectedNote.notes.chapter_no}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Download Status:</span>
                <div className={styles.statusControls}>
                  <span className={`${styles.downloadBadge} ${styles[(selectedNote as any).download_marked_at ? 'downloadedBadge' : 'notDownloadedBadge']}`}>
                    {(selectedNote as any).download_marked_at ? '✓ Downloaded' : '✗ Not Downloaded'}
                  </span>
                  <button
                    onClick={() => handleDownloadStatusToggle(!(selectedNote as any).download_marked_at)}
                    disabled={isUpdatingStatus}
                    className={styles.toggleBtn}
                    title="Toggle download status"
                  >
                    {(selectedNote as any).download_marked_at ? 'Mark Not Downloaded' : 'Mark Downloaded'}
                  </button>
                </div>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}></span>
                <button
                  onClick={() => handleDownloadNotes(selectedNote)}
                  disabled={!selectedNote.download_url || isUpdatingStatus}
                  className={styles.downloadButton}
                  title={selectedNote.download_url ? 'Download the notes' : 'Download URL not available'}
                >
                  {isUpdatingStatus ? 'Downloading...' : '⬇ Download Notes'}
                </button>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment Status:</span>
                <div className={styles.statusControls}>
                  <select 
                    value={selectedNote.status || 'pending'}
                    onChange={(e) => handleStatusChange(e.target.value as 'pending' | 'completed' | 'failed' | 'cancelled')}
                    disabled={isUpdatingStatus}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {isUpdatingStatus && <span className={styles.updatingText}>Updating...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
