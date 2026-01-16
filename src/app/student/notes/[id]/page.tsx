import { Metadata } from 'next';
import axios from 'axios';
import { Notes as NotesType } from '@/types';
import { SITE_NAME, OG_IMAGES, getCanonical } from '@/config/site';
import NotesDetailClient from '../../notes/[id]/client';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notes/${id}`);
    const notes: NotesType = response.data.data;
    
    return {
      title: `${notes.title} | ${SITE_NAME} - Study Notes Marketplace`,
      description: notes.description?.substring(0, 160) || `Quality study notes on ${notes.subject || 'Various Topics'} - Available on ${SITE_NAME}`,
      keywords: [notes.title, notes.subject || 'study notes', 'exam prep', 'educational materials'].filter(Boolean),
      openGraph: {
        title: notes.title,
        description: notes.description?.substring(0, 160) || `Premium study notes available on ${SITE_NAME}`,
        type: 'website',
        url: getCanonical(`/student/notes/${id}`),
        images: [{
          url: OG_IMAGES.notes,
          width: 1200,
          height: 630,
          alt: notes.title,
        }],
      },
      twitter: {
        card: 'summary',
        title: notes.title,
        description: notes.description?.substring(0, 160),
        images: [OG_IMAGES.notes],
      },
      alternates: {
        canonical: getCanonical(`/student/notes/${id}`),
      },
    };
  } catch {
    return {
      title: `Study Notes | ${SITE_NAME}`,
      description: `View quality study notes on ${SITE_NAME} marketplace`,
    };
  }
}

export default function NotesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <NotesDetailClient params={params} />;
}
