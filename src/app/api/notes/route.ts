import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Notes } from '@/types';

// Get all notes
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    // If table doesn't exist or other error, return empty array
    if (error) {
      console.warn('Supabase error fetching notes:', error.message);
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error fetching notes:', error);
    // Return empty array instead of error to allow UI to load
    return NextResponse.json({ data: [] });
  }
}

// Create a new note (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      subject,
      price,
      author,
      image_url,
      google_drive_file_id,
      download_url,
    } = body;

    // Validate admin authorization (should be implemented with proper auth)
    const adminToken = request.headers.get('authorization');
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const newNote: Notes = {
      id: '',
      title,
      description,
      subject,
      price,
      author,
      image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('notes').insert([
      {
        ...newNote,
        google_drive_file_id,
        download_url,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
