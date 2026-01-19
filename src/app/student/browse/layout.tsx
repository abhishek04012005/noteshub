import { Metadata } from 'next';
import React from 'react';
import { SITE_NAME, OG_IMAGES, getCanonical } from '@/config/site';

export const metadata: Metadata = {
  title: `Browse Study Notes | ${SITE_NAME} - Premium Educational Materials`,
  description: 'Explore thousands of high-quality study notes across all subjects. Find exam-ready materials, course notes, and study guides from verified sellers.',
  keywords: ['browse notes', 'study materials', 'educational resources', 'notes for sale', 'study guides', 'course materials'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: `Browse Study Notes - ${SITE_NAME} Marketplace`,
    description: 'Discover quality study notes across multiple subjects and courses',
    type: 'website',
    url: getCanonical('/student/browse'),
    images: [{
      url: OG_IMAGES.browse,
      width: 1200,
      height: 630,
      alt: `Browse Study Notes on ${SITE_NAME}`,
    }],
  },
  alternates: {
    canonical: getCanonical('/student/browse'),
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
