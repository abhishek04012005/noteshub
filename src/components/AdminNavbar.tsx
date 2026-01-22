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
  Dashboard,
  Home
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
      icon: <Dashboard sx={{ fontSize: '1.2rem' }} />,
      match: (path: string) => path === '/admin/dashboard',
    },
    {
      label: 'Notes',
      href: '/admin/dashboard/upload',
      icon: <Add sx={{ fontSize: '1.2rem' }} />,
      match: (path: string) => path.includes('/upload') && !path.includes('syllabus'),
    },
    {
      label: 'Syllabus',
      href: '/admin/dashboard/syllabuses',
      icon: <MenuBook sx={{ fontSize: '1.2rem' }} />,
      match: (path: string) => path.includes('syllabuses') || path.includes('upload-syllabus'),
    },
    {
      label: 'Sales',
      href: '/admin/dashboard/sales',
      icon: <TrendingUp sx={{ fontSize: '1.2rem' }} />,
      match: (path: string) => path.includes('sales'),
    },
    {
      label: 'Syllabus Downloads',
      href: '/admin/dashboard/syllabus-downloads',
      icon: <School sx={{ fontSize: '1.2rem' }} />,
      match: (path: string) => path.includes('syllabus-downloads'),
    },
  ];

  const adminEmail = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('adminEmail') || 'Admin'
    : 'Admin';

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navbarContainer}>
          
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <Link href="/admin/dashboard" className={styles.logo}>
              <MenuBook sx={{ fontSize: '1.75rem' }} />
              <span className={styles.logoText}>NotesHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.navDesktop}>
            <div className={styles.navItemsContainer}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${
                    item.match(pathname) ? styles.navLinkActive : ''
                  }`}
                  title={item.label}
                >
                  <span className={styles.navLinkIcon}>{item.icon}</span>
                  <span className={styles.navLinkLabel}>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Section - Desktop */}
          <div className={styles.userSectionDesktop}>
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>{adminEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Logout"
              aria-label="Logout"
            >
              <LogoutOutlined sx={{ fontSize: '1.2rem' }} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`${styles.mobileMenuBtn} ${mobileMenuOpen ? styles.mobileMenuBtnActive : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <Close sx={{ fontSize: '1.5rem' }} />
            ) : (
              <Menu sx={{ fontSize: '1.5rem' }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu} />
            <nav className={styles.mobileMenu}>
              <div className={styles.mobileMenuHeader}>
                <span className={styles.mobileMenuTitle}>Menu</span>
                <button 
                  className={styles.mobileMenuClose}
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <Close sx={{ fontSize: '1.5rem' }} />
                </button>
              </div>

              <div className={styles.mobileMenuItems}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.mobileMenuItem} ${
                      item.match(pathname) ? styles.mobileMenuItemActive : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <span className={styles.mobileMenuIcon}>{item.icon}</span>
                    <span className={styles.mobileMenuLabel}>{item.label}</span>
                    {item.match(pathname) && (
                      <span className={styles.mobileMenuIndicator}></span>
                    )}
                  </Link>
                ))}
              </div>

              <div className={styles.mobileMenuFooter}>
                <div className={styles.mobileUserInfo}>
                  <span className={styles.mobileUserEmail}>{adminEmail}</span>
                </div>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className={styles.mobileLogoutButton}
                >
                  <LogoutOutlined sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                  Logout
                </button>
              </div>
            </nav>
          </>
        )}
      </header>
    </>
  );
}
