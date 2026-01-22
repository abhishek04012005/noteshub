'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { 
  MenuBook, 
  Add, 
  TrendingUp, 
  School,
  LogoutOutlined,
  Menu,
  Close,
  Dashboard
} from '@mui/icons-material';
import styles from './AdminNavbar.module.css';
import { useState } from 'react';

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminId');
    localStorage.removeItem('isAdminLoggedIn');
    
    router.push('/admin/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <Dashboard sx={{ fontSize: '1rem' }} />,
      match: (path: string) => path === '/admin/dashboard',
    },
    {
      label: 'Upload Notes',
      href: '/admin/dashboard/upload',
      icon: <Add sx={{ fontSize: '1rem' }} />,
      match: (path: string) => path.includes('/upload') && !path.includes('syllabus'),
    },
    {
      label: 'Upload Syllabus',
      href: '/admin/dashboard/upload-syllabus',
      icon: <School sx={{ fontSize: '1rem' }} />,
      match: (path: string) => path.includes('upload-syllabus'),
    },
    {
      label: 'Manage Syllabuses',
      href: '/admin/dashboard/syllabuses',
      icon: <MenuBook sx={{ fontSize: '1rem' }} />,
      match: (path: string) => path.includes('syllabuses'),
    },
    {
      label: 'Sales',
      href: '/admin/dashboard/sales',
      icon: <TrendingUp sx={{ fontSize: '1rem' }} />,
      match: (path: string) => path.includes('sales'),
    },
  ];

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/admin/dashboard" className={styles.navBrand}>
            <MenuBook sx={{ fontSize: '1.5rem', marginRight: '0.5rem' }} />
            <span className={styles.brandText}>Admin Panel</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className={`${styles.mobileMenuToggle} ${mobileMenuOpen ? styles.mobileMenuToggleActive : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <Close sx={{ fontSize: '1.5rem' }} />
            ) : (
              <Menu sx={{ fontSize: '1.5rem' }} />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className={`${styles.navMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  item.match(pathname) ? styles.navItemActive : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className={styles.userSection}>
            <span className={styles.userEmail}>
              {typeof localStorage !== 'undefined' 
                ? localStorage.getItem('adminEmail') || 'Admin'
                : 'Admin'
              }
            </span>
            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
              title="Logout"
            >
              <LogoutOutlined sx={{ fontSize: '1.25rem' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
