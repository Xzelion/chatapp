import { supabase } from '@/lib/supabase';
import { AvatarUploadResponse } from '@/lib/types/profile';
import { retryOperation } from '@/lib/utils/retry';

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<AvatarUploadResponse | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from('profile')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}

export async function deleteAvatar(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('profile')
      .remove([path]);

    return !error;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return false;
  }
}