'use client';

import { HeaderSection } from '@/components/landing/HeaderSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { FeaturedNotesSection } from '@/components/landing/FeaturedNotesSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { ProcessSection } from '@/components/landing/ProcessSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { FooterSection } from '@/components/landing/FooterSection';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <HeaderSection />
      <HeroSection />
      <FeaturesSection />
      <FeaturedNotesSection />
      <TestimonialSection />
      <ProcessSection />
      <FinalCTASection />
      <FooterSection />
    </main>
  );
}
