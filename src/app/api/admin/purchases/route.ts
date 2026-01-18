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
