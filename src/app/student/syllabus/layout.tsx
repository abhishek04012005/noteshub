import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Syllabuses Download | NotesHub - Study Materials',
  description: 'Download free syllabuses for your university, course, and branch. Access comprehensive syllabus documents from verified educators. No registration required.',
  keywords: 'syllabus, free download, university syllabus, course curriculum, study materials, academic documents',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://noteshub.abhishekchoudhary.co.in/student/syllabus',
    title: 'Free Syllabuses Download | NotesHub',
    description: 'Download free syllabuses for your university, course, and branch',
    siteName: 'NotesHub',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  alternates: {
    canonical: 'https://noteshub.abhishekchoudhary.co.in/student/syllabus',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
