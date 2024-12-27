/*
  # Add message reactions support

  1. New Tables
    - `message_reactions`
      - `id` (uuid, primary key)
      - `message_id` (uuid, references messages)
      - `user_id` (uuid, references chat_users)
      - `emoji` (text, the reaction emoji)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on message_reactions table
    - Add policies for users to manage their reactions
*/

CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES chat_users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Allow users to see all reactions
CREATE POLICY "Allow public read access to message_reactions"
  ON message_reactions
  FOR SELECT
  TO public
  USING (true);

-- Allow users to add/remove their own reactions
CREATE POLICY "Allow users to manage their reactions"
  ON message_reactions
  FOR ALL
  TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());