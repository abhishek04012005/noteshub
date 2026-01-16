import { Metadata } from 'next';
import React from 'react';
import { SITE_NAME } from '@/config/site';

export const metadata: Metadata = {
  title: `Sales Analytics | ${SITE_NAME} Admin - Track Revenue`,
  description: `View your sales analytics and earnings on ${SITE_NAME}. Track revenue, analyze customer purchases, and optimize your selling strategy.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
