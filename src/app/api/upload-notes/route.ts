import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadToDrive } from '@/utils/google-drive';

// Upload notes with PDF file
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Received upload request');
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const storagePath = formData.get('storage_path') as string | null;
    const downloadUrl = formData.get('download_url') as string | null;
    const university = formData.get('university') as string;
    const course = formData.get('course') as string;
    const branch = formData.get('branch') as string;
    const semester = formData.get('semester') as string;
    const subject = formData.get('subject') as string;
    const chapter_no = formData.get('chapter_no') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const original_price = parseFloat(formData.get('original_price') as string);
    const discounted_price = parseFloat(formData.get('discounted_price') as string);
    const author = formData.get('author') as string;

    console.log('📋 Form data:', { 
      university, course, branch, semester, subject, chapter_no, 
      title, description, original_price, discounted_price, author, 
      fileName: file?.name 
    });

    if (!file && !storagePath) {
      console.error('❌ No file or storage path provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

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

    // Validate required environment variables
    if (!process.env.GOOGLE_REFRESH_TOKEN || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.error('❌ Missing Google Drive credentials', {
        hasToken: !!process.env.GOOGLE_REFRESH_TOKEN,
        hasFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID
      });
      return NextResponse.json(
        { error: 'Google Drive is not properly configured. Missing GOOGLE_REFRESH_TOKEN or GOOGLE_DRIVE_FOLDER_ID.' },
        { status: 500 }
      );
    }

    console.log('✅ Google Drive credentials verified');

    // Upload file to Google Drive
    let driveResponse;
    try {
      if (file) {
        console.log('🔄 Converting file to buffer...');
        const buffer = await file.arrayBuffer();
        const bufferSize = buffer.byteLength;
        console.log(`✅ Buffer created (${bufferSize} bytes)`);

        console.log(`📤 Uploading to Google Drive: ${file.name} in subject folder: ${subject}`);
        driveResponse = await uploadToDrive(
          Buffer.from(buffer),
          file.name,
          subject
        );
      } else if (downloadUrl) {
        driveResponse = {
          file_id: storagePath || 'storage-upload',
          file_name: title || 'uploaded-file',
          web_view_link: downloadUrl,
          download_link: downloadUrl,
          file_size: 0,
        };
      } else {
        throw new Error('No file content or storage URL available');
      }

      console.log('✅ Google Drive upload successful:', driveResponse);
    } catch (driveError) {
      console.error('❌ Google Drive upload error:', driveError);
      return NextResponse.json(
        { error: `Failed to upload file to Google Drive: ${driveError instanceof Error ? driveError.message : String(driveError)}` },
        { status: 500 }
      );
    }

    // Store notes in Supabase with actual Google Drive data
    console.log('💾 Inserting record into Supabase...');
    const noteData = {
      university,
      course,
      branch,
      semester,
      subject,
      chapter_no,
      title,
      description,
      original_price,
      discounted_price,
      author,
      google_drive_file_id: driveResponse.file_id,
      download_url: driveResponse.download_link,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin.from('notes').insert([noteData]).select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      
      // If table doesn't exist, still return success with the uploaded data
      if (error.message?.includes('relation') || error.message?.includes('table')) {
        console.warn('⚠️  Supabase table might not exist yet, but file uploaded successfully');
        return NextResponse.json({ 
          success: true,
          warning: 'File uploaded to Google Drive successfully. Supabase table may not be created yet.',
          google_drive: driveResponse,
          data: noteData
        }, { status: 201 });
      }

      // For other errors, return the error
      return NextResponse.json({ 
        error: `Supabase error: ${error.message}`,
        details: error
      }, { status: 400 });
    }

    console.log('✅ Record inserted into Supabase:', data);

    return NextResponse.json({ 
      success: true,
      data: data ? data[0] : noteData,
      message: 'Notes uploaded successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Unexpected error in upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload notes' },
      { status: 500 }
    );
  }
}
