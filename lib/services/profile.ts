import { supabase } from '../supabase';
import { UserProfile, ProfileUpdateData } from '../types/user';
import { retryOperation } from '../utils/retry';

export async function updateProfile(
  userId: string,
  data: ProfileUpdateData
): Promise<UserProfile | null> {
  return retryOperation(async () => {
    const { data: profile, error } = await supabase
      .from('chat_users')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  });
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);

    await updateProfile(userId, { avatar_url: publicUrl });
    return publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}