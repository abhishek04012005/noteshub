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
} from '@mui/icons-material';
import { Purchase } from '@/types';
import styles from './sales.module.css';

export default function AdminSalesPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    setIsAdmin(true);
    fetchPurchases();
  }, [router]);

  const fetchPurchases = async () => {
    try {
      // Fetch all purchases from admin endpoint
      const response = await axios.get('/api/admin/purchases');
      const purchaseData = response.data.data || [];
      setPurchases(purchaseData);

      // Calculate total sales and revenue
      const totalCount = purchaseData.length;
      const totalAmount = purchaseData.reduce(
        (sum: number, purchase: Purchase) => sum + purchase.amount,
        0
      );

      setTotalSales(totalCount);
      setTotalRevenue(totalAmount);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      // Show empty state if error
      setPurchases([]);
      setTotalSales(0);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear server-side cookie
      await axios.post('/api/admin/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    // Clear client-side data
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminId');
    localStorage.removeItem('isAdminLoggedIn');
    
    router.push('/admin/login');
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
              Sales Dashboard
            </h1>
            <p className={styles.headerEmail}>
              {localStorage.getItem('adminEmail')}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className={styles.navBtn}
            >
              <ArrowBack sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Back to Dashboard
            </button>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <Logout sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {/* Stats Section */}
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <BarChart sx={{ fontSize: '2.5rem', color: 'var(--primary-600)' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Total Sales</p>
                <p className={styles.statValue}>{totalSales}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <AttachMoney sx={{ fontSize: '2.5rem', color: 'var(--success)' }} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Total Revenue</p>
                <p className={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Purchases Table */}
          <div className={styles.tableSection}>
            <h2 className={styles.sectionTitle}>
              <BarChart sx={{ fontSize: '1.25rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Purchase History
            </h2>

            {loading ? (
              <div className={styles.loadingContainer}>
                <p className={styles.loadingText}>Loading purchases...</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className={styles.emptyState}>
                <FolderOff sx={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-light)' }} />
                <p className={styles.emptyMessage}>
                  No purchases yet. When students buy your notes, they'll appear here.
                </p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeader}>Customer Name</th>
                      <th className={styles.tableHeader}>Email</th>
                      <th className={styles.tableHeader}>Amount</th>
                      <th className={styles.tableHeader}>Transaction ID</th>
                      <th className={styles.tableHeader}>Status</th>
                      <th className={styles.tableHeader}>Date</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <span className={styles.nameCell}>
                            {purchase.customer_name}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.emailCell}>
                            {purchase.customer_email}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.amountCell}>
                            ₹{purchase.amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <code className={styles.transactionId}>
                            {purchase.razorpay_payment_id.slice(0, 12)}...
                          </code>
                        </td>
                        <td className={styles.tableCell}>
                          <span
                            className={`${styles.statusBadge} ${
                              purchase.status === 'completed'
                                ? styles.statusCompleted
                                : purchase.status === 'pending'
                                ? styles.statusPending
                                : styles.statusFailed
                            }`}
                          >
                            {purchase.status.charAt(0).toUpperCase() +
                              purchase.status.slice(1)}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.dateCell}>
                            {new Date(purchase.created_at).toLocaleDateString(
                              'en-IN',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
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
