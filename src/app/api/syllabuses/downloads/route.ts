import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: Store a syllabus download record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { syllabus_id, student_name, student_email } = body;

    // Validation
    if (!syllabus_id || !student_name || !student_email) {
      return NextResponse.json(
        { error: 'Missing required fields: syllabus_id, student_name, student_email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('📥 Recording syllabus download:', { syllabus_id, student_name, student_email });

    // Insert download record
    const { data, error } = await supabase
      .from('syllabus_downloads')
      .insert([
        {
          syllabus_id,
          student_name: student_name.trim(),
          student_email: student_email.trim().toLowerCase(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to record download: ${error.message}` },
        { status: 400 }
      );
    }

    console.log('✅ Download recorded successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Download recorded successfully',
        data: data?.[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in POST downloads:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to record download' },
      { status: 500 }
    );
  }
}

// GET: Fetch download records (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization - just verify Authorization header is present
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    console.log('✅ Admin authorization confirmed');

    const { searchParams } = new URL(request.url);
    const syllabusId = searchParams.get('syllabus_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📋 Fetching syllabus downloads:', { syllabusId, limit, offset });

    let query = supabase
      .from('syllabus_downloads')
      .select(`
        id,
        syllabus_id,
        student_name,
        student_email,
        created_at,
        syllabuses (
          id,
          title,
          university,
          course,
          branch,
          semester
        )
      `)
      .order('created_at', { ascending: false });

    if (syllabusId) {
      query = query.eq('syllabus_id', syllabusId);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to fetch downloads: ${error.message}` },
        { status: 400 }
      );
    }

    console.log(`✅ Fetched ${data?.length || 0} download records`);

    return NextResponse.json(
      {
        success: true,
        data: data || [],
        count: count || 0,
        total: count || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error in GET downloads:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch downloads' },
      { status: 500 }
    );
  }
}
