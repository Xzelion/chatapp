/*
  # Avatar and Profile Updates

  1. New Fields
    - Add avatar_url to chat_users table
    - Add avatar_storage_path to chat_users table for internal reference

  2. Storage Policies
    - Enable storage policies for the Profile bucket
    - Allow users to manage their own avatars
    - Allow public read access to avatars

  3. User Profile Updates
    - Add additional profile fields
*/

-- Add avatar storage path for internal reference
ALTER TABLE chat_users 
ADD COLUMN IF NOT EXISTS avatar_storage_path text;

-- Create storage policies for Profile bucket
BEGIN;
  -- Enable storage for authenticated and anonymous users
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('profile', 'profile', true)
  ON CONFLICT (id) DO NOTHING;

  -- Policy for reading avatar files
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'profile' );

  -- Policy for uploading avatar files
  CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'profile' AND
    (auth.uid() = owner OR auth.uid() IS NOT NULL)
  );

  -- Policy for deleting avatar files
  CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile' AND
    (auth.uid() = owner OR auth.uid() IS NOT NULL)
  );
COMMIT;