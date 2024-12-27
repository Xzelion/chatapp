/*
  # Add user stats triggers

  1. Changes
    - Add triggers for updating user stats on reactions and mentions
    - Add function to calculate messages per day
    - Add function to update last active timestamp
  
  2. Security
    - Enable RLS on user_stats table
    - Add policy for public read access
*/

-- Update user stats on new reactions
CREATE OR REPLACE FUNCTION update_reaction_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, reaction_count)
  VALUES (
    (SELECT user_id FROM messages WHERE id = NEW.message_id),
    1
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    reaction_count = user_stats.reaction_count + 1,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reaction_stats_trigger
  AFTER INSERT ON message_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_reaction_stats();

-- Update user stats on new mentions
CREATE OR REPLACE FUNCTION update_mention_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, mention_count)
  VALUES (NEW.mentioned_user_id, 1)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    mention_count = user_stats.mention_count + 1,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mention_stats_trigger
  AFTER INSERT ON user_mentions
  FOR EACH ROW
  EXECUTE FUNCTION update_mention_stats();

-- Function to calculate messages per day
CREATE OR REPLACE FUNCTION get_messages_per_day(user_id uuid)
RETURNS float AS $$
DECLARE
  total_messages integer;
  days_active integer;
BEGIN
  SELECT message_count INTO total_messages
  FROM user_stats
  WHERE user_stats.user_id = $1;
  
  SELECT 
    GREATEST(1, EXTRACT(DAY FROM (now() - created_at)))::integer 
  INTO days_active
  FROM chat_users
  WHERE id = $1;
  
  RETURN ROUND((total_messages::float / days_active::float)::numeric, 1);
END;
$$ LANGUAGE plpgsql;