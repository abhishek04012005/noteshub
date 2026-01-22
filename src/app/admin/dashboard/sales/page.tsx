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
  Person,
  DateRange,
  CheckCircle,
} from '@mui/icons-material';
import { Purchase } from '@/types';
import styles from './sales.module.css';

export default function AdminSalesPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Purchase | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed' | 'cancelled'>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    todaysSales: 0,
    thisMonthSales: 0,
    uniqueCustomers: 0,
    completionRate: '0%',
  });

  const itemsPerPage = 15;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    setIsAdmin(true);
    fetchSalesData();

    const interval = setInterval(fetchSalesData, 10000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    applyFilters();
  }, [purchases, searchQuery, sortBy, filterStatus, filterDateRange]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('/api/admin/purchases');
      const data = response.data.data || [];
      setPurchases(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (data: Purchase[]) => {
    const completedSales = data.filter((p: Purchase) => p.status === 'completed');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysSalesCount = completedSales.filter(
      (p: Purchase) => new Date(p.created_at).getTime() >= today.getTime()
    ).length;

    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
    
    const thisMonthSalesCount = completedSales.filter(
      (p: Purchase) => new Date(p.created_at).getTime() >= monthStart.getTime()
    ).length;

    const revenue = completedSales.reduce((sum: number, purchase: Purchase) => sum + (purchase.amount || 0), 0);
    const uniqueEmails = new Set(data.map(d => d.customer_email || d.email)).size;
    const completionRate = data.length > 0 ? Math.round((completedSales.length / data.length) * 100) : 0;

    setStats({
      totalSales: completedSales.length,
      totalRevenue: revenue,
      todaysSales: todaysSalesCount,
      thisMonthSales: thisMonthSalesCount,
      uniqueCustomers: uniqueEmails,
      completionRate: `${completionRate}%`,
    });

    setTotalSales(completedSales.length);
    setTotalRevenue(revenue);
  };

  const applyFilters = () => {
    let filtered = [...purchases];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          (p.customer_name?.toLowerCase().includes(query) || false) ||
          (p.customer_email?.toLowerCase().includes(query) || false) ||
          (p.email?.toLowerCase().includes(query) || false)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status?.toLowerCase() === filterStatus);
    }

    // Date range filter
    if (filterDateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (filterDateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        p => new Date(p.created_at).getTime() >= startDate.getTime()
      );
    }

    // Sort
    if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredPurchases(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = ['Date', 'Customer Name', 'Email', 'Amount', 'Payment ID', 'Status'];
    const csvContent = [
      headers.join(','),
      ...purchases.map(p =>
        `"${new Date(p.created_at).toLocaleDateString()}","${p.customer_name || 'N/A'}","${p.customer_email || p.email || 'N/A'}","${p.amount || '0'}","${p.razorpay_payment_id || 'N/A'}","${p.status || 'Pending'}"`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
        calculateStats(updatedPurchases);
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
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <a href="/admin/dashboard" className={styles.backLink}>
            <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Dashboard
          </a>
          <h1 className={styles.title}>
            <TrendingUp sx={{ fontSize: '1.75rem', marginRight: '0.5rem', verticalAlign: 'middle' }} style={{ display: 'inline' }} />
            Sales Analytics
          </h1>
          <p className={styles.subtitle}>
            Track your earnings, sales performance, and customer engagement
          </p>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <BarChart sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Total Sales</p>
                <p className={styles.statValue}>{stats.totalSales}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <AttachMoney sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Total Revenue</p>
                <p className={styles.statValue}>₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Person sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Unique Customers</p>
                <p className={styles.statValue}>{stats.uniqueCustomers}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <DateRange sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Today's Sales</p>
                <p className={styles.statValue}>{stats.todaysSales}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <BarChart sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>This Month</p>
                <p className={styles.statValue}>{stats.thisMonthSales}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CheckCircle sx={{ fontSize: '1.75rem' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Completion Rate</p>
                <p className={styles.statValue}>{stats.completionRate}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search by customer name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filtersGroup}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className={styles.filterSelect}
                title="Filter by payment status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value as any)}
                className={styles.filterSelect}
                title="Filter by date range"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
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

          {/* Sales Table Section */}
          <div className={styles.tableSection}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <p className={styles.loadingText}>Loading sales data...</p>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className={styles.emptyState}>
                <FolderOff sx={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
                <h3>No sales found</h3>
                <p>Your sales will appear here once customers purchase your notes</p>
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead className={styles.tableHead}>
                      <tr>
                        <th>Note Details</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                      {paginatedPurchases.map((purchase, index) => {
                        const normalizedStatus = purchase.status?.toLowerCase() || 'pending';
                        let displayStatus = purchase.status?.charAt(0).toUpperCase() + purchase.status?.slice(1).toLowerCase() || 'Pending';
                        
                        if (normalizedStatus === 'completed' && !purchase.download_url) {
                          displayStatus = 'Completed - Not Downloaded';
                        }
                        
                        return (
                          <tr key={purchase.id} className={index % 2 === 0 ? styles.rowAlternate : ''}>
                            <td>
                              <div className={styles.notesCell}>
                                <div className={styles.notesTitle}>{purchase.notes?.title || 'N/A'}</div>
                                <div className={styles.notesInfo}>
                                  {purchase.notes?.university} • {purchase.notes?.course} • {purchase.notes?.branch}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className={styles.nameCell}>
                                <Person sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                                {purchase.customer_name || 'N/A'}
                              </div>
                            </td>
                            <td>
                              <div className={styles.emailCell}>
                                {purchase.customer_email || purchase.email || 'N/A'}
                              </div>
                            </td>
                            <td className={styles.amountCell}>₹{purchase.amount?.toLocaleString('en-IN') || '0'}</td>
                            <td>
                              {new Date(purchase.created_at).toLocaleString('en-IN', {
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
                                onClick={() => setSelectedNote(purchase)}
                                title="View details"
                              >
                                <Info sx={{ fontSize: '1.25rem' }} />
                              </button>
                            </td>
                            <td>
                              <span className={`${styles.badge} ${styles[`status${displayStatus.replace(/ /g, '')}`]}`}>
                                {displayStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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
        </div>
      </div>
    </main>
  );
}
