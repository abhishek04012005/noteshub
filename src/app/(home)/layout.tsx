import { Metadata } from 'next';
import React from 'react';
import { SITE_URL, SITE_DESCRIPTION, SITE_NAME, SITE_KEYWORDS, OG_IMAGES, getCanonical } from '@/config/site';

export const metadata: Metadata = {
  title: `${SITE_NAME} - Buy All University Study Notes Online | Premium Marketplace | RGPV | Syllabus Download`,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
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
    title: `${SITE_NAME} - Premium Study Notes Marketplace`,
    description: 'Buy  quality study notes online. Join thousands of students earning from their knowledge.',
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{
      url: OG_IMAGES.default,
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} - Study Notes Marketplace`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Buy Study Notes`,
    description: 'Join the premier marketplace for educational notes',
    images: [OG_IMAGES.default],
  },
  alternates: {
    canonical: getCanonical('/'),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
