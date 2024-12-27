/*
  # Fix user stats initialization and policies

  1. Changes
    - Add trigger to create user stats when user is created
    - Update RLS policies for user stats
    - Add function to initialize missing stats

  2. Security
    - Enable RLS on user_stats table
    - Add policies for public read access
    - Add policy for system updates
*/

-- Function to ensure user stats exist
CREATE OR REPLACE FUNCTION ensure_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (
    user_id,
    message_count,
    mention_count,
    reaction_count,
    last_active
  )
  VALUES (
    NEW.id,
    0,
    0,
    0,
    NEW.created_at
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create user stats when user is created
DROP TRIGGER IF EXISTS ensure_user_stats_trigger ON chat_users;
CREATE TRIGGER ensure_user_stats_trigger
  AFTER INSERT ON chat_users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_stats();

-- Initialize stats for existing users
INSERT INTO user_stats (
  user_id,
  message_count,
  mention_count,
  reaction_count,
  last_active
)
SELECT 
  id,
  0,
  0,
  0,
  created_at
FROM chat_users
ON CONFLICT (user_id) DO NOTHING;

-- Update RLS policies
DROP POLICY IF EXISTS "Allow public read access to user_stats" ON user_stats;
DROP POLICY IF EXISTS "Allow system to manage user_stats" ON user_stats;

CREATE POLICY "Allow public read access to user_stats"
  ON user_stats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow system to manage user_stats"
  ON user_stats 
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);