import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Create sample notes if they don't exist
    const sampleNotes = [
      {
        title: 'Artificial Intelligence - Chapter 1 Notes',
        description: 'Comprehensive notes on Artificial Intelligence Chapter 1 covering fundamentals of AI, machine learning basics, and neural networks introduction.',
        university: 'RGPV',
        course: 'B.Tech',
        branch: 'Computer Science',
        semester: 'Sem 5',
        subject: 'Artificial Intelligence',
        chapter_no: 'Chapter 1',
        original_price: 299,
        discounted_price: 199,
        author: 'Dr. John Doe',
        image_url: 'https://via.placeholder.com/300x400?text=AI+Notes',
      },
      {
        title: 'Database Management Systems - Chapter 1',
        description: 'Complete notes on DBMS fundamentals including database concepts, ACID properties, and SQL basics.',
        university: 'RGPV',
        course: 'B.Tech',
        branch: 'Computer Science',
        semester: 'Sem 4',
        subject: 'Database Management System',
        chapter_no: 'Chapter 1',
        original_price: 249,
        discounted_price: 149,
        author: 'Prof. Jane Smith',
        image_url: 'https://via.placeholder.com/300x400?text=DBMS+Notes',
      },
      {
        title: 'Web Development Basics - Chapter 1',
        description: 'Essential web development notes covering HTML, CSS, JavaScript fundamentals and web architecture.',
        university: 'RGPV',
        course: 'B.Tech',
        branch: 'Information Technology',
        semester: 'Sem 3',
        subject: 'Web Development',
        chapter_no: 'Chapter 1',
        original_price: 199,
        discounted_price: 99,
        author: 'Tech Instructor',
        image_url: 'https://via.placeholder.com/300x400?text=Web+Dev+Notes',
      },
    ];

    const { data, error } = await supabase
      .from('notes')
      .insert(sampleNotes)
      .select();

    if (error) {
      console.error('Error inserting sample notes:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Sample notes created successfully',
      count: data?.length || 0,
      notes: data,
    });
  } catch (error) {
    console.error('Error in seed endpoint:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
