import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download Syllabus | NotesHub - Free Study Materials',
  description:
    'Download your free syllabus with instant access. Enter your name and email to get the complete syllabus PDF. Fast, secure, and completely free.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SyllabusDownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
