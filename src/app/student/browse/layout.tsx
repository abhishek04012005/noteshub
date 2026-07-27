import { Metadata } from 'next';
import React from 'react';
import { SITE_NAME, OG_IMAGES, getCanonical } from '@/config/site';

export const metadata: Metadata = {
  title: `Study Notes Marketplace | Buy Handwritten Notes PDF | Handmade Notes | Examination Notes | RGPV Notes${SITE_NAME}`,

  description:
    'Buy and sell high-quality handwritten study notes, PDF notes, engineering notes, B.Tech semester notes, RGPV notes, university notes, exam preparation materials, previous year notes, and study resources. Download verified handwritten notes for better exam preparation.',

  keywords: [
    'study notes',
    'handwritten notes',
    'handwritten study notes',
    'PDF notes',
    'engineering notes',
    'B.Tech notes',
    'RGPV notes',
    'semester notes',
    'college notes',
    'exam notes',
    'exam preparation',
    'study material',
    'lecture notes',
    'university notes',
    'course notes',
    'class notes',
    'revision notes',
    'buy study notes',
    'sell study notes',
    'notes marketplace',
    'student notes',
    'education marketplace',
    'study resources',
    'download notes',
    'academic notes',
    'computer science notes',
    'data mining notes',
    'software engineering notes',
    'computer graphics notes',
    'wireless mobile computing notes',
    'engineering chemistry notes'
  ],

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
    title: `Buy & Sell Study Notes | Handwritten Notes PDF | ${SITE_NAME}`,

    description:
      'Discover premium handwritten study notes, engineering notes, B.Tech notes, semester exam materials, and verified PDF study resources from students and educators.',

    type: 'website',
    url: getCanonical('/student/browse'),

    images: [
      {
        url: OG_IMAGES.browse,
        width: 1200,
        height: 630,
        alt: `Study Notes Marketplace - ${SITE_NAME}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Study Notes Marketplace | ${SITE_NAME}`,
    description:
      'Buy and sell handwritten study notes, engineering notes, PDF notes, and exam preparation materials.',
    images: [OG_IMAGES.browse],
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
