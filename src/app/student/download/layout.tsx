import { Metadata } from 'next';
import React from 'react';
import { SITE_NAME } from '@/config/site';

export const metadata: Metadata = {
  title: `Download Your Notes | ${SITE_NAME} - Secure Purchase`,
  description: `Access your purchased study notes instantly. Download high-quality educational materials from ${SITE_NAME} with secure payment and verified sellers.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
