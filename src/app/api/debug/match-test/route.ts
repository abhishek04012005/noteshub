import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function normalizeString(str: string | undefined): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/-/g, ' ')
    .replace(/\.\s*/g, '') // Remove dots and spaces around them
    .replace(/\s+/g, ' ');
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const university = searchParams.get('university') || 'rgpv';
    const course = searchParams.get('course') || 'btech';
    const subject = searchParams.get('subject') || 'artificial-intelligence';
    const chapter = searchParams.get('chapter') || 'chapter-1';

    const { data, error } = await supabase
      .from('notes')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    const normalizedUniversity = normalizeString(decodeURIComponent(university));
    const normalizedCourse = normalizeString(decodeURIComponent(course));
    const normalizedSubject = normalizeString(decodeURIComponent(subject));
    const normalizedChapter = normalizeString(decodeURIComponent(chapter));

    const searchCriteria = {
      normalizedUniversity,
      normalizedCourse,
      normalizedSubject,
      normalizedChapter,
    };

    const matchResults = (data || []).map((note: any) => ({
      id: note.id,
      title: note.title,
      matches: {
        university: {
          db: normalizeString(note.university),
          search: normalizedUniversity,
          match: normalizeString(note.university) === normalizedUniversity,
        },
        course: {
          db: normalizeString(note.course),
          search: normalizedCourse,
          match: normalizeString(note.course) === normalizedCourse,
        },
        subject: {
          db: normalizeString(note.subject),
          search: normalizedSubject,
          match: normalizeString(note.subject) === normalizedSubject,
        },
        chapter: {
          db: normalizeString(note.chapter_no),
          search: normalizedChapter,
          match: normalizeString(note.chapter_no) === normalizedChapter,
        },
      },
      fullMatch: 
        normalizeString(note.university) === normalizedUniversity &&
        normalizeString(note.course) === normalizedCourse &&
        normalizeString(note.subject) === normalizedSubject &&
        normalizeString(note.chapter_no) === normalizedChapter,
    }));

    return NextResponse.json({
      searchCriteria,
      totalNotesInDb: (data || []).length,
      matchResults,
      foundMatch: matchResults.some((m: any) => m.fullMatch),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
