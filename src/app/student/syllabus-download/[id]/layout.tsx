import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { OG_IMAGES } from '@/config/site';

function slugify(value: string | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildSyllabusSlug(syllabus: { university?: string; course?: string; branch?: string; semester?: string; title?: string; id?: string }) {
  const parts = [slugify(syllabus.university), slugify(syllabus.course), slugify(syllabus.branch), slugify(syllabus.semester), slugify(syllabus.title)].filter(Boolean);
  return parts.length > 0 ? parts.join('-') : syllabus.id || 'syllabus';
}

interface Syllabus {
  id: string;
  title: string;
  university: string;
  course: string;
  branch: string;
  semester: string;
  description?: string;
}

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id } = await params;
    
    // Fetch directly from Supabase
    const { data: syllabus, error } = await supabaseClient
      .from('syllabuses')
      .select('id, title, university, course, branch, semester, description')
      .eq('id', id)
      .single();

    if (error || !syllabus) {
      console.error('Error fetching syllabus:', error);
      return {
        title: 'Syllabus Download | NotesHub',
        description: 'Download syllabus from NotesHub',
      };
    }

    const pageTitle = `${syllabus.title} | ${syllabus.university} ${syllabus.course} ${syllabus.branch} - Semester ${syllabus.semester}`;
    const pageDescription = `Download ${syllabus.title} syllabus for ${syllabus.university} ${syllabus.course} ${syllabus.branch} Semester ${syllabus.semester}. Free PDF download available on NotesHub.`;
    const slug = buildSyllabusSlug(syllabus);

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: [
        syllabus.title,
        syllabus.university,
        syllabus.course,
        syllabus.branch,
        `Semester ${syllabus.semester}`,
        'syllabus',
        'download',
        'PDF',
      ],
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: 'website',
        url: `https://noteshub.abhishekchoudhary.co.in/student/syllabus-download/${slug}`,
        images: [{ url: OG_IMAGES.default }],
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
      },
      robots: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
      alternates: {
        canonical: `https://noteshub.abhishekchoudhary.co.in/student/syllabus-download/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Syllabus Download | NotesHub',
      description: 'Download  syllabuses from NotesHub',
    };
  }
}

export default function Layout({ children }: Props) {
  return children;
}
