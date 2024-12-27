-- Add RLS policies for user_stats table
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Allow users to read any user's stats
CREATE POLICY "Allow public read access to user_stats"
  ON user_stats FOR SELECT
  TO public
  USING (true);

-- Allow system to update user stats
CREATE POLICY "Allow system to manage user stats"
  ON user_stats FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create or update user stats trigger function
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.type != 'system' THEN
    INSERT INTO user_stats (
      user_id,
      message_count,
      mention_count,
      reaction_count,
      last_active
    )
    VALUES (
      NEW.user_id,
      1,
      0,
      0,
      now()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      message_count = user_stats.message_count + 1,
      last_active = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;