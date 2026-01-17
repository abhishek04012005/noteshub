import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, university, course, subject, chapter_no')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json({ 
        error: error.message,
        notes: []
      });
    }

    console.log('Available notes:', data);

    return NextResponse.json({ 
      total: data?.length || 0,
      notes: data || [],
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json({
      error: String(error),
      notes: []
    });
  }
}
