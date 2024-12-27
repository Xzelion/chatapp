import { supabase } from '@/lib/supabase';
import { ProfileSettings } from '@/lib/types/profile';
import { retryOperation } from '@/lib/utils/retry';

export async function updateUserSettings(
  userId: string,
  settings: Partial<ProfileSettings>
): Promise<boolean> {
  return retryOperation(async () => {
    const { error } = await supabase
      .from('chat_users')
      .update({ settings })
      .eq('id', userId);

    return !error;
  });
}

export async function getUserSettings(userId: string): Promise<ProfileSettings | null> {
  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('chat_users')
      .select('settings')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.settings;
  });
}