import { supabase } from '../supabaseClient';

export async function uploadImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to the 'artworks' bucket
  const { data, error } = await supabase.storage
    .from('artworks')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Get the public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('artworks')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
} 