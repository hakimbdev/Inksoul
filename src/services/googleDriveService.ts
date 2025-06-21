import { GOOGLE_APIS_CONFIG } from '../config/googleApis';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
}

class GoogleDriveService {
  private accessToken: string | null = null;

  async authenticate(): Promise<boolean> {
    try {
      // Initialize Google Auth
      const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${GOOGLE_APIS_CONFIG.DRIVE_API_KEY}&redirect_uri=${window.location.origin}&scope=https://www.googleapis.com/auth/drive.file&response_type=token`;
      
      // For demo purposes, we'll simulate authentication
      // In production, implement proper OAuth2 flow
      this.accessToken = 'demo_token';
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async uploadFile(
    file: Blob,
    fileName: string,
    mimeType: string,
    folderId?: string
  ): Promise<DriveFile | null> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const metadata = {
        name: fileName,
        ...(folderId && { parents: [folderId] }),
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }

  async createFolder(name: string, parentId?: string): Promise<DriveFile | null> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const metadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentId && { parents: [parentId] }),
      };

      const response = await fetch(`${GOOGLE_APIS_CONFIG.DRIVE_API_URL}/files`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error('Folder creation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Folder creation error:', error);
      return null;
    }
  }

  async listFiles(folderId?: string): Promise<DriveFile[]> {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const query = folderId ? `'${folderId}' in parents` : '';
      const response = await fetch(
        `${GOOGLE_APIS_CONFIG.DRIVE_API_URL}/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,createdTime,modifiedTime,size,webViewLink,webContentLink)`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to list files');
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('List files error:', error);
      return [];
    }
  }

  async saveArtwork(canvas: HTMLCanvasElement, fileName: string): Promise<boolean> {
    try {
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(false);
            return;
          }

          const result = await this.uploadFile(blob, fileName, 'image/png');
          resolve(!!result);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Save artwork error:', error);
      return false;
    }
  }
}

export const googleDriveService = new GoogleDriveService();