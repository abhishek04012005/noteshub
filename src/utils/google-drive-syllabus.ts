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

/**
 * Get or create a folder with given name and parent folder ID
 */
async function getOrCreateFolder(
  folderName: string,
  parentFolderId: string
): Promise<string> {
  try {
    // Search for existing folder
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 1,
    } as any);

    if (response.data.files && response.data.files.length > 0) {
      console.log(`✅ Found existing folder: ${folderName}`);
      return response.data.files[0].id || '';
    }

    // Create new folder
    console.log(`🆕 Creating new folder: ${folderName}`);
    const createResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      },
      fields: 'id, name',
    } as any);

    const folderId = createResponse.data.id || '';
    console.log(`✅ Created folder: ${folderName} (ID: ${folderId})`);
    return folderId;
  } catch (error) {
    console.error(`❌ Error managing folder ${folderName}:`, error);
    throw new Error(`Failed to get/create folder ${folderName}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get or create nested folder structure for syllabuses
 * Structure: syllabuses/UNIVERSITY/BRANCH/SEMESTER
 */
export async function getOrCreateSyllabusFolder(
  university: string,
  branch: string,
  semester: string
): Promise<string> {
  try {
    console.log(`📁 Getting/creating syllabus folder structure: ${university}/${branch}/${semester}`);

    // Get main syllabuses folder
    const syllabusesFolder = await getOrCreateFolder(
      'syllabuses',
      process.env.GOOGLE_DRIVE_FOLDER_ID || ''
    );

    // Get university folder
    const universityFolder = await getOrCreateFolder(
      university,
      syllabusesFolder
    );

    // Get branch folder
    const branchFolder = await getOrCreateFolder(
      branch,
      universityFolder
    );

    // Get semester folder
    const semesterFolder = await getOrCreateFolder(
      semester,
      branchFolder
    );

    console.log(`✅ Syllabus folder structure ready: ${semesterFolder}`);
    return semesterFolder;
  } catch (error) {
    console.error('❌ Error creating syllabus folder structure:', error);
    throw error;
  }
}

/**
 * Upload syllabus file to Google Drive with nested folder structure
 */
export async function uploadSyllabusToDrive(
  fileBuffer: Buffer,
  fileName: string,
  university: string,
  branch: string,
  semester: string
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

    console.log(`📤 Uploading syllabus to Google Drive: ${fileName}`);
    console.log(`📁 Path: syllabuses/${university}/${branch}/${semester}`);

    // Get or create nested folder structure
    const parentFolderId = await getOrCreateSyllabusFolder(
      university,
      branch,
      semester
    );

    // Create a readable stream from the buffer
    const bufferStream = Readable.from(fileBuffer);

    const fileMetadata = {
      name: fileName,
      parents: [parentFolderId],
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

    const fileId = response.data.id || '';
    const fileName_returned = response.data.name || '';

    console.log(`✅ File uploaded successfully:`, {
      fileId,
      fileName: fileName_returned,
      webViewLink: response.data.webViewLink,
      size: response.data.size,
    });

    // Generate download link
    const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    return {
      file_id: fileId,
      file_name: fileName_returned,
      download_link: downloadLink,
      web_view_link: response.data.webViewLink || '',
      file_size: response.data.size ? parseInt(response.data.size as string) : 0,
    };
  } catch (error) {
    console.error('❌ Error uploading syllabus to Google Drive:', error);
    throw new Error(
      `Failed to upload syllabus to Google Drive: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Delete a file from Google Drive by file ID
 */
export async function deleteFromDrive(fileId: string): Promise<void> {
  try {
    console.log(`🗑️ Deleting file from Google Drive: ${fileId}`);

    await drive.files.delete({
      fileId: fileId,
    } as any);

    console.log(`✅ File deleted successfully: ${fileId}`);
  } catch (error) {
    console.error('❌ Error deleting file from Google Drive:', error);
    throw new Error(
      `Failed to delete file from Google Drive: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
