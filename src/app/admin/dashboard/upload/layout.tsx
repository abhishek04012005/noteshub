import { Metadata } from 'next';
import React from 'react';
import { SITE_NAME } from '@/config/site';

export const metadata: Metadata = {
  title: `Upload Notes | ${SITE_NAME} Admin - Share Your Materials`,
  description: `Upload your study notes to ${SITE_NAME}. Share your knowledge, reach thousands of students, and start earning instantly.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
