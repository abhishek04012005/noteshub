import { Metadata } from 'next';
import React from 'react';
import { SITE_NAME } from '@/config/site';

export const metadata: Metadata = {
  title: `Admin Login | ${SITE_NAME} Dashboard`,
  description: `Admin login portal for ${SITE_NAME} sellers. Manage your notes, track sales, and control your marketplace presence securely.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
