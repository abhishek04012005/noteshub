import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteFromDrive } from '@/utils/google-drive-syllabus';

// GET: Fetch a single syllabus by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`📖 Fetching syllabus: ${id}`);

    const { data, error } = await supabaseAdmin
      .from('syllabuses')
      .select('*')
      .eq('id', id)
      .single();

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
