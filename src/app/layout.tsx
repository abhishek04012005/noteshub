import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NotesHub - Premium Study Notes Marketplace | Buy  Notes Online",
  description: "Access premium quality study notes from top educators. Browse thousands of notes for engineering, arts, and commerce students. Secure payments and instant downloads.",
  keywords: [
    "study notes",
    "class notes",
    "lecture notes",
    "exam preparation",
    "engineering notes",
    "university notes",
    "notes marketplace",
    "buy notes online",
    "pdf notes",
    "study materials",
  ],
  authors: [{ name: "NotesHub Team" }],
  creator: "NotesHub",
  publisher: "NotesHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abhishekchoudhary.co.in",
    title: "NotesHub - Premium Study Notes Marketplace",
    description: "Buy  quality study notes online. Instant access with secure payment.",
    siteName: "NotesHub",
    images: [
      {
        url: "https://abhishekchoudhary.co.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "NotesHub - Study Notes Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NotesHub - Premium Study Notes",
    description: "Browse and buy quality study notes from top educators",
    images: ["https://abhishekchoudhary.co.in/twitter-image.png"],
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
    canonical: "https://abhishekchoudhary.co.in",
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
        {children}
      </body>
    </html>
  );
}
