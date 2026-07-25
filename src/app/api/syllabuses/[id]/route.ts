import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteFromDrive } from '@/utils/google-drive-syllabus';

function slugify(value: string | undefined): string {
  if (!value) return '';

  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');

  const slug = normalized.replace(/^-+|-+$/g, '');
  return slug === 'b-tech' || slug === 'btech' ? 'btech' : slug;
}

function buildSyllabusSlug(syllabus: { university?: string; course?: string; branch?: string; semester?: string; title?: string; id?: string }) {
  const parts = [slugify(syllabus.university), slugify(syllabus.course), slugify(syllabus.branch), slugify(syllabus.semester), slugify(syllabus.title)].filter(Boolean);
  return parts.length > 0 ? parts.join('-') : syllabus.id || 'syllabus';
}

function normalizeForComparison(value: string | undefined): string {
  return slugify(value).replace(/-/g, '');
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// GET: Fetch a single syllabus by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`📖 Fetching syllabus: ${id}`);

    let data = null;
    let error = null;

    if (isUuid(id)) {
      const result = await supabaseAdmin
        .from('syllabuses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      data = result.data;
      error = result.error;
    } else {
      const result = await supabaseAdmin
        .from('syllabuses')
        .select('*');

      if (result.error) {
        error = result.error;
      } else {
        const normalizedLookup = normalizeForComparison(id);
        data = result.data?.find((item) => {
          const slug = buildSyllabusSlug(item);
          const normalizedSlug = normalizeForComparison(slug);
          return normalizedSlug === normalizedLookup || slug === id;
        }) ?? null;
      }
    }

    if (error || !data) {
      console.error('❌ Syllabus not found:', error);
      return NextResponse.json(
        { error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    console.log('✅ Syllabus fetched:', data);

    return NextResponse.json({ 
      success: true,
      data: data
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching syllabus:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch syllabus' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a syllabus by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    console.log(`🗑️ Deleting syllabus: ${id}`);

    // Get syllabus details before deleting
    const { data: syllabusData, error: fetchError } = await supabaseAdmin
      .from('syllabuses')
      .select('google_drive_file_id')
      .eq('id', id)
      .single();

    if (fetchError || !syllabusData) {
      console.error('❌ Syllabus not found:', fetchError);
      return NextResponse.json(
        { error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    // Delete from Google Drive
    try {
      if (syllabusData.google_drive_file_id) {
        await deleteFromDrive(syllabusData.google_drive_file_id);
      }
    } catch (driveError) {
      console.error('⚠️  Warning: Failed to delete from Google Drive, but continuing with database deletion:', driveError);
    }

    // Delete from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from('syllabuses')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('❌ Supabase delete error:', deleteError);
      return NextResponse.json(
        { error: `Failed to delete syllabus: ${deleteError.message}` },
        { status: 400 }
      );
    }

    console.log(`✅ Syllabus deleted: ${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Syllabus deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error deleting syllabus:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete syllabus' },
      { status: 500 }
    );
  }
}

// PUT: Update a syllabus
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { university, course, branch, semester, title, description, author } = body;

    console.log(`📝 Updating syllabus: ${id}`);

    // Update in Supabase
    const { data, error } = await supabaseAdmin
      .from('syllabuses')
      .update({
        university,
        course,
        branch,
        semester,
        title,
        description,
        author,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      return NextResponse.json(
        { error: `Failed to update syllabus: ${error.message}` },
        { status: 400 }
      );
    }

    console.log('✅ Syllabus updated:', data);

    return NextResponse.json({ 
      success: true,
      data: data,
      message: 'Syllabus updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error updating syllabus:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update syllabus' },
      { status: 500 }
    );
  }
}
