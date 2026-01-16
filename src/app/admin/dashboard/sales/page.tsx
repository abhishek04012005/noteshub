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
    fetchSalesData();
  }, [router]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('/api/admin/purchases');
      const data = response.data.data || [];
      setPurchases(data);
      setTotalSales(data.length);
      setTotalRevenue(data.reduce((sum: number, purchase: Purchase) => sum + (purchase.amount || 0), 0));
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
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
              Sales Analytics
            </h1>
            <p className={styles.headerEmail}>Track your earnings and sales performance</p>
          </div>

          <div className={styles.headerActions}>
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
                    <th className={styles.tableHeader}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{new Date(purchase.created_at).toLocaleDateString()}</td>
                      <td className={`${styles.tableCell} ${styles.nameCell}`}>{purchase.customer_name || 'N/A'}</td>
                      <td className={`${styles.tableCell} ${styles.emailCell}`}>{purchase.customer_email || purchase.email || 'N/A'}</td>
                      <td className={`${styles.tableCell} ${styles.amountCell}`}>₹{purchase.amount?.toLocaleString('en-IN') || '0'}</td>
                      <td className={`${styles.tableCell} ${styles.transactionId}`}>{purchase.razorpay_payment_id?.substring(0, 12)}...</td>
                      <td className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${styles[`status${purchase.status?.charAt(0).toUpperCase() + purchase.status?.slice(1).toLowerCase() || 'Pending'}`]}`}>
                          {purchase.status?.charAt(0).toUpperCase() + purchase.status?.slice(1).toLowerCase() || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
