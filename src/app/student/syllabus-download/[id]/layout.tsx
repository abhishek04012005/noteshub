import { Metadata, ResolvingMetadata } from 'next';
import axios from 'axios';

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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id } = await params;
    
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/syllabuses/${id}`
    );
    
    const syllabus: Syllabus = response.data.data;

    if (!syllabus) {
      return {
        title: 'Syllabus Download | NotesHub',
        description: 'Download syllabus from NotesHub',
      };
    }

    const pageTitle = `${syllabus.title} - ${syllabus.university} ${syllabus.course} ${syllabus.branch} Sem ${syllabus.semester}`;
    const pageDescription = `Download ${syllabus.title} syllabus for ${syllabus.university} ${syllabus.course} ${syllabus.branch} Semester ${syllabus.semester}. Free PDF download available on NotesHub.`;

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
        url: `https://noteshub.abhishekchoudhary.co.in/student/syllabus-download/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
      },
      robots: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
      alternates: {
        canonical: `https://noteshub.abhishekchoudhary.co.in/student/syllabus-download/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Syllabus Download | NotesHub',
      description: 'Download free syllabuses from NotesHub',
    };
  }
}

export default function Layout({ children }: Props) {
  return children;
}
