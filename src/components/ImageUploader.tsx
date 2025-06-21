import React, { useState } from 'react';
import { uploadImage } from '../services/uploadImage';

export default function ImageUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, userId);
      setImageUrl(url);
      alert('Upload successful!');
    } catch (err) {
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {imageUrl && <img src={imageUrl} alt="Uploaded artwork" style={{ maxWidth: 200, marginTop: 16 }} />}
    </div>
  );
} 