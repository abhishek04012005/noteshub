import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const BUCKET_NAME = process.env.NEXT_PUBLIC_NOTES_BUCKET || 'notes-files';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const fileName = body?.fileName as string | undefined;
    const contentType = body?.contentType as string | undefined;

    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    try {
      const { data: bucketData, error: bucketError } = await (supabaseAdmin.storage as any).getBucket(BUCKET_NAME);
      if (bucketError || !bucketData) {
        await (supabaseAdmin.storage as any).createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: '100MB',
        });
      }
    } catch {
      // Ignore bucket creation errors and continue; the next request may still succeed.
    }

    const storagePath = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    const { data, error } = await (supabaseAdmin.storage as any).from(BUCKET_NAME).createSignedUploadUrl(storagePath);

    if (error || !data?.signedUrl) {
      console.error('Failed to create signed upload URL:', error);
      return NextResponse.json(
        { error: 'Failed to prepare upload storage' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      uploadUrl: data.signedUrl,
      storagePath,
      contentType: contentType || 'application/pdf',
      publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`,
    });
  } catch (error) {
    console.error('Presign upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to prepare upload' },
      { status: 500 }
    );
  }
}
