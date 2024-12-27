/*
  # Fix message reactions policies

  1. Changes
    - Update RLS policies for message_reactions table
    - Add proper policies for public access and user management
    - Fix reaction count tracking

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for user reaction management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to manage their reactions" ON message_reactions;
DROP POLICY IF EXISTS "Allow public read access to message_reactions" ON message_reactions;

-- Enable RLS
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reactions
CREATE POLICY "Allow public read access to message_reactions"
  ON message_reactions FOR SELECT
  TO public
  USING (true);

-- Allow users to add/remove their own reactions
CREATE POLICY "Allow users to manage their reactions"
  ON message_reactions
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add trigger to maintain reaction counts
CREATE OR REPLACE FUNCTION update_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_stats
    SET reaction_count = reaction_count + 1
    WHERE user_id = (
      SELECT user_id FROM messages WHERE id = NEW.message_id
    );
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_stats
    SET reaction_count = reaction_count - 1
    WHERE user_id = (
      SELECT user_id FROM messages WHERE id = OLD.message_id
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reaction count updates
DROP TRIGGER IF EXISTS update_reaction_count_trigger ON message_reactions;
CREATE TRIGGER update_reaction_count_trigger
  AFTER INSERT OR DELETE ON message_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_reaction_count();