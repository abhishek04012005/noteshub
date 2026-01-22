import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syllabuses Download | NotesHub - Study Materials',
  description:
    'Download syllabuses for your university, course, and branch. Access comprehensive syllabus documents from verified educators. No registration required.',
  keywords:
    'syllabus,  download, university syllabus, course curriculum, study materials, academic documents',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://noteshub.abhishekchoudhary.co.in/student/syllabuses',
    title: ' Syllabuses | NotesHub',
    description: 'Download  study syllabuses for your course and university',
    siteName: 'NotesHub',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://noteshub.abhishekchoudhary.co.in/student/syllabuses',
  },
};

export default function SyllabusesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
