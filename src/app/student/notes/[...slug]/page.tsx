import { Metadata } from 'next';
import axios from 'axios';
import { Notes as NotesType } from '@/types';
import { SITE_NAME, OG_IMAGES, getCanonical } from '@/config/site';
import NotesDetailClient from './client';

// Helper function to extract UUID from slug
function extractIdFromSlug(slug: string): string {
  // UUID pattern: 8-4-4-4-12 hex digits
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = slug.match(uuidPattern);
  return match ? match[1] : slug;
}

// Helper function to normalize strings for comparison
function slugifyValue(str: string | undefined): string {
  if (!str) return '';

  return decodeURIComponent(String(str))
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to find note by university, course, subject, chapter
async function findNoteByDetails(
  slugArray: string[]
): Promise<NotesType | null> {
  if (slugArray.length !== 3 && slugArray.length !== 4) {
    return null;
  }

  const [university, course, subject, chapter] = slugArray;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notes`
    );
    const notes: NotesType[] = response.data.data || [];

    const normalizedUniversity = slugifyValue(university);
    const normalizedCourse = slugifyValue(course);
    const normalizedSubject = slugifyValue(subject);
    const normalizedChapter = chapter ? slugifyValue(chapter) : '';

    console.log('Looking for:', { normalizedUniversity, normalizedCourse, normalizedSubject, normalizedChapter });

    const exactMatch = notes.find((note) => {
      const noteUniversity = slugifyValue(note.university);
      const noteCourse = slugifyValue(note.course);
      const noteSubject = slugifyValue(note.subject);
      const noteChapter = slugifyValue(note.chapter_no);

      const match =
        noteUniversity === normalizedUniversity &&
        noteCourse === normalizedCourse &&
        noteSubject === normalizedSubject &&
        (slugArray.length === 3 || noteChapter === normalizedChapter);

      if (match) {
        console.log('Found exact match:', { noteUniversity, noteCourse, noteSubject, noteChapter });
      }

      return match;
    });

    if (exactMatch) {
      return exactMatch;
    }

    if (slugArray.length === 4) {
      const partialMatch = notes.find((note) => {
        const noteUniversity = slugifyValue(note.university);
        const noteCourse = slugifyValue(note.course);
        const noteSubject = slugifyValue(note.subject);

        return (
          noteUniversity === normalizedUniversity &&
          noteCourse === normalizedCourse &&
          noteSubject === normalizedSubject
        );
      });

      if (partialMatch) {
        console.log('Found partial 3-part match:', partialMatch);
        return partialMatch;
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding note by details:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug?: string[] }> | { slug?: string[] } }
): Promise<Metadata> {
  const resolvedParams = params && typeof params === 'object' && 'then' in params ? await params : params;
  const slug = resolvedParams?.slug ?? [];
  let id = '';
  let notes: NotesType | null = null;

  // Try to find note by nested parameters first
  if (slug.length === 4) {
    notes = await findNoteByDetails(slug);
    if (notes) {
      id = notes.id;
    }
  } else if (slug.length === 1) {
    // Traditional slug format with UUID
    id = extractIdFromSlug(slug[0]);
  }

  // If not found by nested parameters and we have a traditional ID, fetch it
  if (!notes && id) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notes/${id}`);
      notes = response.data.data;
    } catch (error) {
      // Note not found
    }
  }

  const fullPath = `/student/notes/${slug.join('/')}`;

  if (notes) {
    const noteDescription = notes.description?.trim() || '';
    const fallbackDescription = notes.title
      ? `${notes.title} | Quality study notes available on ${SITE_NAME}`
      : `Quality study notes on ${notes.subject || 'Various Topics'} - Available on ${SITE_NAME}`;
    const metaDescription = noteDescription || fallbackDescription;

    const metaTitle = notes.title || SITE_NAME;

    // Build keywords string explicitly so Next renders a proper content attribute
    const keywordsArray = [
      notes.title,
      notes.subject || 'study notes',
      notes.branch || '',
      notes.course || '',
      notes.university || '',
      'Exam Preparation',
      'Study Notes',
      'Handwritten Notes',
      'Engineering Notes',
      'B.Tech Notes',
      'RGPV Notes',
      'Educational Materials',
      'Topper Notes',
      'Quality Notes',
      'Complete Study Notes',
      'Study Material',
      'Exam Notes',
      'Revision Notes',
      'Quick Revision',
      'Important Questions',
      'Solved Notes',
      'Semester Notes',
      'Chapter Wise Notes',
      'Unit Wise Notes',
      'Topic Wise Notes',
      'PDF Notes',
      'Digital Notes',
      'University Notes',
      'College Notes',
      'Computer Science Notes',
      'Engineering Study Material',
      'Exam Ready Notes',
      'Last Minute Revision',
      'Easy Learning Notes',
      'Premium Notes',
      'Best Study Notes',
      'Notes PDF Download',
      'B.Tech Study Material',
      'RGPV Study Material',
      'RGPV Handwritten Notes',
      'Engineering Exam Notes',
      'Student Notes',
      'Learning Resources',
      'Academic Notes',
      'Exam Success',
      'High Quality Notes',
      'Concept Based Notes',
      'Visual Learning Notes',
      'Illustrated Notes',
      'Handmade Notes',
      'Self Study Material',
      'Class Notes',
      'Detailed Notes',
      'Complete Revision',
      'Educational Resources'

    ].filter((keyword): keyword is string => Boolean(keyword));
    const keywordsString = keywordsArray.join(', ');

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywordsString,
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
        title: metaTitle,
        description: metaDescription,
        type: 'website',
        url: getCanonical(fullPath),
        images: [{
          url: notes.image_url || OG_IMAGES.notes,
          width: 1200,
          height: 630,
          alt: notes.title,
        }],
      },
      twitter: {
        card: 'summary',
        title: metaTitle,
        description: metaDescription,
        images: [OG_IMAGES.notes],
      },
      alternates: {
        canonical: getCanonical(`/student/notes/${slug.join('/')}`),
      },
    };
  }

  // Fallback metadata when note is not found but URL has proper structure
  if (slug.length === 4) {
    const [university, course, subject, chapter] = slug.map(s =>
      decodeURIComponent(s).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    );

    const fallbackTitle = `${subject} - Chapter ${chapter.replace(/^chapter-?/, '')} | ${university} ${course}`;
    const fallbackDescription = `Study notes for ${subject} at ${university} in ${course} course. Chapter ${chapter.replace(/^chapter-?/, '')} notes available.`;

    return {
      title: `${fallbackTitle} | ${SITE_NAME}`,
      description: fallbackDescription,
      keywords: [university, course, subject, chapter, 'study notes', 'exam prep'],
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
        title: `${fallbackTitle} | ${SITE_NAME}`,
        description: fallbackDescription,
        type: 'website',
        url: getCanonical(fullPath),
        images: [{
          url: OG_IMAGES.notes,
          width: 1200,
          height: 630,
          alt: subject,
        }],
      },
      twitter: {
        card: 'summary',
        title: `${fallbackTitle} | ${SITE_NAME}`,
        description: fallbackDescription,
        images: [OG_IMAGES.notes],
      },
      alternates: {
        canonical: getCanonical(`/student/notes/${slug.join('/')}`),
      },
    };
  }

  return {
    title: `Study Notes | ${SITE_NAME}`,
    description: `View quality study notes on ${SITE_NAME} marketplace`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: getCanonical(`/student/notes/${slug.join('/')}`),
    },
  };
}

export default async function NotesDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}) {
  const resolvedParams = params && typeof params === 'object' && 'then' in params ? await params : params;
  return <NotesDetailClient params={resolvedParams} />;
}
