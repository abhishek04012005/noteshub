import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteFromDrive } from '@/utils/google-drive-syllabus';

// GET: Fetch all syllabuses or filter by university/branch/semester
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const university = searchParams.get('university');
    const branch = searchParams.get('branch');
    const semester = searchParams.get('semester');

    console.log('📋 Fetching syllabuses:', { university, branch, semester });

    let query = supabaseAdmin
      .from('syllabuses')
      .select('*')
      .eq('is_free', true);

    if (university) {
      query = query.eq('university', university);
    }
    if (branch) {
      query = query.eq('branch', branch);
    }
    if (semester) {
      query = query.eq('semester', semester);
    }

    // Order by most recent
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      return NextResponse.json(
        { error: `Failed to fetch syllabuses: ${error.message}` },
        { status: 400 }
      );
    }

    console.log(`✅ Fetched ${data?.length || 0} syllabuses`);

    return NextResponse.json({ 
      success: true,
      data: data || [],
      count: data?.length || 0
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in GET syllabuses:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch syllabuses' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a syllabus
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const syllabusId = searchParams.get('id');

    if (!syllabusId) {
      return NextResponse.json(
        { error: 'Syllabus ID is required' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deleting syllabus: ${syllabusId}`);

    // Get syllabus details before deleting
    const { data: syllabusData, error: fetchError } = await supabaseAdmin
      .from('syllabuses')
      .select('google_drive_file_id')
      .eq('id', syllabusId)
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
      .eq('id', syllabusId);

    if (deleteError) {
      console.error('❌ Supabase delete error:', deleteError);
      return NextResponse.json(
        { error: `Failed to delete syllabus: ${deleteError.message}` },
        { status: 400 }
      );
    }

    console.log(`✅ Syllabus deleted: ${syllabusId}`);

    return NextResponse.json({ 
      success: true,
      message: 'Syllabus deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in DELETE syllabus:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete syllabus' },
      { status: 500 }
    );
  }
}

// PUT: Increment download count
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const syllabusId = searchParams.get('id');
    const action = searchParams.get('action');

    if (!syllabusId) {
      return NextResponse.json(
        { error: 'Syllabus ID is required' },
        { status: 400 }
      );
    }

    if (action === 'increment-downloads') {
      console.log(`⬆️ Incrementing download count for: ${syllabusId}`);

      const { error } = await supabaseAdmin
        .from('syllabuses')
        .update({ 
          download_count: supabaseAdmin.rpc('increment_download_count', { syllabus_id: syllabusId }),
          updated_at: new Date().toISOString()
        })
        .eq('id', syllabusId);

      if (error) {
        console.error('❌ Error incrementing download count:', error);
        // Don't fail the download if this fails, just log it
      } else {
        console.log(`✅ Download count incremented for: ${syllabusId}`);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Download count updated'
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in PUT syllabus:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update syllabus' },
      { status: 500 }
    );
  }
}
