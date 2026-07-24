import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, OG_IMAGES, SITE_KEYWORDS } from '@/config/site';
import { HomePageSchema, NotesMarketplaceSchema } from '@/components/SchemaOrg';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_NAME} - Premium Study Notes Marketplace | Buy Notes Online`,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} - Premium Study Notes Marketplace`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGES.default,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Study Notes Marketplace`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Premium Study Notes`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGES.default],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "LqdrH0oG-qXmeIiCTO9ba4rSrJ6Uek0HqYP8rnS_ZN8",
  },
  alternates: {
    canonical: SITE_URL,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HomePageSchema />
        <NotesMarketplaceSchema />
        {children}
      </body>
    </html>
  );
}
