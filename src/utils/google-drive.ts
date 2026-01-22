import { google } from 'googleapis';
import { GoogleDriveUploadResponse } from '@/types';
import { Readable } from 'stream';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
);

// Set refresh token for authentication
if (process.env.GOOGLE_REFRESH_TOKEN) {
  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
} else {
  console.warn('⚠️  GOOGLE_REFRESH_TOKEN not found in environment variables');
}

const drive = google.drive({ version: 'v3', auth });

async function getOrCreateSubjectFolder(subject: string): Promise<string> {
  try {
    console.log(`📁 Looking for folder: ${subject}`);

    // Search for existing folder
    const response = await drive.files.list({
      q: `name='${subject}' and mimeType='application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 1,
    } as any);

    if (response.data.files && response.data.files.length > 0) {
      console.log(`✅ Found existing folder: ${subject}`);
      return response.data.files[0].id || '';
    }

    // Create new folder
    console.log(`🆕 Creating new folder: ${subject}`);
    const createResponse = await drive.files.create({
      requestBody: {
        name: subject,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''],
      },
      fields: 'id, name',
    } as any);

    const folderId = createResponse.data.id || '';
    console.log(`✅ Created folder: ${subject} (ID: ${folderId})`);
    return folderId;
  } catch (error) {
    console.error('❌ Error managing subject folder:', error);
    throw new Error(`Failed to get/create subject folder: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  subject: string = 'General'
): Promise<GoogleDriveUploadResponse> {
  try {
    // Validate environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google Client ID or Client Secret is missing');
    }

    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      throw new Error('GOOGLE_REFRESH_TOKEN is missing');
    }

    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID is missing');
    }

    console.log(`📤 Uploading file to Google Drive: ${fileName} (Subject: ${subject})`);

    // Get or create subject folder
    const subjectFolderId = await getOrCreateSubjectFolder(subject);

    // Create a readable stream from the buffer
    const bufferStream = Readable.from(fileBuffer);

    const fileMetadata = {
      name: fileName,
      parents: [subjectFolderId],
    };

    const media = {
      mimeType: 'application/pdf',
      body: bufferStream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata as any,
      media: media,
      fields: 'id, name, webViewLink, mimeType, size',
      supportsAllDrives: true,
    } as any);

    const fileId = response.data.id;
    const uploadedFileName = response.data.name;
    const webViewLink = response.data.webViewLink;

    if (!fileId) {
      throw new Error('No file ID returned from Google Drive');
    }

    // Generate direct download link
    const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    console.log(`✅ File uploaded successfully:`, {
      fileId,
      fileName: uploadedFileName,
      subject,
      downloadLink,
    });

    return {
      file_id: fileId,
      file_name: uploadedFileName || fileName,
      web_view_link: webViewLink || '',
      download_link: downloadLink,
      file_size: response.data.size ? parseInt(response.data.size as string) : 0,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error uploading to Google Drive:', errorMessage);
    throw new Error(`Google Drive upload failed: ${errorMessage}`);
  }
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  try {
    if (!fileId) {
      throw new Error('File ID is required');
    }

    console.log(`🗑️  Deleting file from Google Drive: ${fileId}`);

    await drive.files.delete({ 
      fileId,
      supportsAllDrives: true,
    } as any);

    console.log(`✅ File deleted successfully: ${fileId}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error deleting from Google Drive:', errorMessage);
    throw new Error(`Google Drive deletion failed: ${errorMessage}`);
  }
}
