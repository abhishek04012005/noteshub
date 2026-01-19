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
function normalizeString(str: string | undefined): string {
  if (!str) return '';
  return decodeURIComponent(str)
    .toLowerCase()
    .trim()
    .replace(/-/g, ' ')
    .replace(/\.\s*/g, '') // Remove dots and spaces around them
    .replace(/\s+/g, ' ');
}

// Helper function to find note by university, course, subject, chapter
async function findNoteByDetails(
  slugArray: string[]
): Promise<NotesType | null> {
  // Check if it's a nested route: [university, course, subject, chapter]
  if (slugArray.length === 4) {
    const [university, course, subject, chapter] = slugArray;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notes`
      );
      const notes: NotesType[] = response.data.data || [];

      const normalizedUniversity = normalizeString(university);
      const normalizedCourse = normalizeString(course);
      const normalizedSubject = normalizeString(subject);
      const normalizedChapter = normalizeString(chapter);

      console.log('Looking for:', { normalizedUniversity, normalizedCourse, normalizedSubject, normalizedChapter });

      const found = notes.find((note) => {
        const noteUniversity = normalizeString(note.university);
        const noteCourse = normalizeString(note.course);
        const noteSubject = normalizeString(note.subject);
        const noteChapter = normalizeString(note.chapter_no);

        const match = 
          noteUniversity === normalizedUniversity &&
          noteCourse === normalizedCourse &&
          noteSubject === normalizedSubject &&
          noteChapter === normalizedChapter;

        if (match) {
          console.log('Found match:', { noteUniversity, noteCourse, noteSubject, noteChapter });
        }

        return match;
      });

      return found || null;
    } catch (error) {
      console.error('Error finding note by details:', error);
      return null;
    }
  }

  return null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;
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

  if (notes) {
    // Build detailed title with university, course, branch, subject
    const titleParts = [
      notes.title,
      notes.subject,
      notes.branch,
      notes.course,
      notes.university,
    ].filter(Boolean);
    
    const detailedTitle = titleParts.slice(0, 4).join(' - ');
    const fullTitle = `${detailedTitle} | ${SITE_NAME}`;

    // Build keywords array
    const keywordsArray = [
      notes.title,
      notes.subject || 'study notes',
      notes.branch,
      notes.course,
      notes.university,
      'exam prep',
      'educational materials'
    ].filter((keyword): keyword is string => Boolean(keyword));
    
    return {
      title: fullTitle,
      description: notes.description?.substring(0, 160) || `Quality study notes on ${notes.subject || 'Various Topics'} - Available on ${SITE_NAME}`,
      keywords: keywordsArray,
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
        title: fullTitle,
        description: notes.description?.substring(0, 160) || `Premium study notes available on ${SITE_NAME}`,
        type: 'website',
        url: getCanonical(`/student/notes/${slug.length === 4 ? slug.join('/') : slug[0]}`),
        images: [{
          url: OG_IMAGES.notes,
          width: 1200,
          height: 630,
          alt: notes.title,
        }],
      },
      twitter: {
        card: 'summary',
        title: fullTitle,
        description: notes.description?.substring(0, 160),
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
        url: getCanonical(`/student/notes/${slug.join('/')}`),
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

export default function NotesDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return <NotesDetailClient params={params} />;
}
