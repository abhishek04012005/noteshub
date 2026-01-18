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

// Update purchase status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { purchaseId, status } = body;

    if (!purchaseId || !status) {
      return NextResponse.json(
        { error: 'purchaseId and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('purchases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', purchaseId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating purchase status:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase status' },
      { status: 500 }
    );
  }
}
