'use client';

import { NotesList } from '@/components/NotesCard';
import Link from 'next/link';
import { MenuBook, Lock, School, Phone, TrendingUp, Star, Search, Payment, Download } from '@mui/icons-material';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* ========== NAVIGATION ========== */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <MenuBook sx={{ fontSize: '1.5rem', color: 'var(--primary-600)' }} />
            </div>
            <span className={styles.logoText}>NotesHub</span>
          </Link>

          <nav className={styles.nav}>
            {['Home', 'Browse', 'Features'].map((item) => (
              <Link
                key={item}
                href={item === 'Browse' ? '/student/browse' : '/'}
                className={styles.navLink}>
                {item}
              </Link>
            ))}
          </nav>

          <Link href="/admin/login" className={styles.adminBtn}>
            Admin
          </Link>
        </div>
      </header>

      {/* ========== HERO SECTION =========== */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroBlur1}></div>
          <div className={styles.heroBlur2}></div>
        </div>

        <div className={styles.heroContent}>
          {/* Trust Badge */}
          <div className={styles.heroBadge}>
            <Star sx={{ fontSize: '1rem' }} />
            <span>Trusted by 1000+ Students • 4.8★ Rating</span>
          </div>

          {/* Main Title */}
          <h1 className={styles.heroTitle}>
            Master Your Studies with <span className={styles.heroTitleHighlight}>Expert Notes</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.heroDescription}>
            Access premium study materials from top educators. Learn smarter, study less, achieve more.
          </p>

          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>✓</div>
              <span>Instant Download</span>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🔒</div>
              <span>100% Secure</span>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>⭐</div>
              <span>Verified Sellers</span>
            </div>
          </div>

          {/* CTAs */}
          <div className={styles.heroCTAContainer}>
            <Link href="/student/browse" className={styles.heroCTAPrimary}>
              Download Notes
            </Link>
            {/* <Link href="/student/browse" className={styles.heroCTASecondary}>
              Download Syllabus
            </Link> */}
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Trusted</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>₹5-99</div>
              <div className={styles.statLabel}>Affordable Pricing</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES GRID ========== */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>Why Students Love NotesHub</h2>
            <p className={styles.featuresSubtitle}>Everything you need to ace your exams</p>
          </div>

          <div className={styles.featuresGrid}>
            {[
              {
                icon: Lock,
                title: 'Secure & Safe',
                desc: 'Your data is encrypted. Trusted payment gateway with zero fraud.'
              },
              {
                icon: School,
                title: 'Verified Experts',
                desc: 'Only notes from experienced educators and top performers.'
              },
              {
                icon: Phone,
                title: 'Mobile Ready',
                desc: 'Perfect for phones, tablets, and all devices.'
              },
              {
                icon: TrendingUp,
                title: 'Affordable Prices',
                desc: 'Quality education at pocket-friendly rates.'
              }
            ].map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <div key={i} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <IconComponent sx={{ fontSize: '2rem', color: 'var(--primary-600)' }} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FEATURED NOTES ========== */}
      <section className={styles.featured}>
        <div className={styles.featuredContainer}>
          <div className={styles.featuredHeader}>
            <div>
              <div className={styles.featuredBadge}>
                <Star sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                TRENDING NOW
              </div>
              <h2 className={styles.featuredTitle}>Most Downloaded Notes</h2>
            </div>
            <Link href="/student/browse" className={styles.featuredViewAll}>
              View All →
            </Link>
          </div>

          <NotesList />

          <div className={styles.featuredCTA}>
            <Link href="/student/browse" className={styles.featuredCTABtn}>
              Explore Full Library
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIAL BANNER ========== */}
      <section className={styles.testimonial}>
        <div className={styles.testimonialContainer}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} sx={{ fontSize: '1.5rem', color: 'var(--star, #FFB800)' }} />
              ))}
            </div>
            <h3 className={styles.testimonialTitle}>Join Thousands of Successful Students</h3>
            <p className={styles.testimonialDesc}>
              Our users have improved their grades by an average of 15-20 points after using NotesHub
            </p>
            <Link href="/student/browse" className={styles.testimonialBtn}>
              Start Your Success Story
            </Link>
          </div>
        </div>
      </section>

      {/* ========== PROCESS SECTION ========== */}
      <section className={styles.process}>
        <div className={styles.processContainer}>
          <h2 className={styles.processTitle}>How It Works</h2>
          <p className={styles.processSubtitle}>Get quality notes in 3 simple steps</p>

          <div className={styles.processGrid}>
            {[
              { step: '1', icon: Search, title: 'Browse', desc: 'Explore thousands of notes' },
              { step: '2', icon: Payment, title: 'Purchase', desc: 'Secure payment in seconds' },
              { step: '3', icon: Download, title: 'Download', desc: 'Instant access to your files' }
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className={styles.processItem}>
                  <div className={styles.processStep}>{item.step}</div>
                  <div className={styles.processIcon}>
                    <IconComponent sx={{ fontSize: '2rem', color: 'var(--primary-600)' }} />
                  </div>
                  <h3 className={styles.processItemTitle}>{item.title}</h3>
                  <p className={styles.processItemDesc}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className={styles.finalCTA}>
        <div className={styles.finalCTAContainer}>
          <div className={styles.finalCTACard}>
            <h2 className={styles.finalCTATitle}>Ready to Excel?</h2>
            <p className={styles.finalCTADesc}>
              Start your journey to academic success today. No registration needed to browse.
            </p>
            <Link href="/student/browse" className={styles.finalCTABtn}>
              Browse Now
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <h4>Platform</h4>
              <ul className={styles.footerList}>
                <li><Link href="/" className={styles.footerLink}>Home</Link></li>
                <li><Link href="/student/browse" className={styles.footerLink}>Browse Notes</Link></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>For Educators</h4>
              <ul className={styles.footerList}>
                <li><Link href="/admin/login" className={styles.footerLink}>Upload Notes</Link></li>
                <li><Link href="/admin/login" className={styles.footerLink}>Dashboard</Link></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <ul className={styles.footerList}>
                <li><Link href="#" className={styles.footerLink}>Privacy</Link></li>
                <li><Link href="#" className={styles.footerLink}>Terms</Link></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Contact</h4>
              <ul className={styles.footerList}>
                <li><a href="mailto:support@noteshub.com" className={styles.footerLink}>Email</a></li>
                <li><a href="#" className={styles.footerLink}>Support</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopy}>© 2024 NotesHub. All rights reserved.</p>
            <p className={styles.footerCopy}>Made with ❤️ by the NotesHub Team</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
