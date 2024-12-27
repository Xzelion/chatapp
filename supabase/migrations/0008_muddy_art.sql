/*
  # Chat Features Enhancement

  1. New Tables
    - `user_mentions` - Track @mentions in messages
    - `user_stats` - Track user activity statistics
  
  2. Changes
    - Add full-text search to messages
    - Add formatting metadata to messages
    - Add user statistics tracking
*/

-- Enable full text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add formatting metadata to messages
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS formatting jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS mentions jsonb DEFAULT '[]'::jsonb;

-- Create user mentions table
CREATE TABLE IF NOT EXISTS user_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  mentioned_user_id uuid REFERENCES chat_users(id) ON DELETE CASCADE,
  mentioning_user_id uuid REFERENCES chat_users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, mentioned_user_id)
);

-- Create user stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES chat_users(id) ON DELETE CASCADE,
  message_count integer DEFAULT 0,
  mention_count integer DEFAULT 0,
  reaction_count integer DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update message count
  IF TG_OP = 'INSERT' AND NEW.type != 'system' THEN
    INSERT INTO user_stats (user_id, message_count)
    VALUES (NEW.user_id, 1)
    ON CONFLICT (user_id) DO UPDATE
    SET message_count = user_stats.message_count + 1,
        last_active = now(),
        updated_at = now();
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user stats
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Add full text search index
CREATE INDEX messages_content_search_idx ON messages
USING gin(to_tsvector('english', content));

-- Enable RLS
ALTER TABLE user_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to user_mentions"
  ON user_mentions FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access to user_stats"
  ON user_stats FOR SELECT TO public
  USING (true);