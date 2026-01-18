import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all purchases - for admin dashboard to see all sales
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(
        `*,
        notes:notes_id(
          id,
          university,
          course,
          branch,
          semester,
          subject,
          chapter_no,
          title
        )`
      )
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching all purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

// Update purchase status and download status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { purchaseId, status, markDownloaded } = body;

    if (!purchaseId) {
      return NextResponse.json(
        { error: 'purchaseId is required' },
        { status: 400 }
      );
    }

    let updateData: any = { updated_at: new Date().toISOString() };

    if (status) {
      const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (markDownloaded !== undefined) {
      if (markDownloaded === true) {
        updateData.download_marked_at = new Date().toISOString();
      } else if (markDownloaded === false) {
        updateData.download_marked_at = null;
      }
    }

    const { data, error } = await supabase
      .from('purchases')
      .update(updateData)
      .eq('id', purchaseId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating purchase:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase' },
      { status: 500 }
    );
  }
}
