/*
  # Add Message Threading Support

  1. Changes
    - Add parent_id column to messages table for thread relationships
    - Add reply_count column to track number of replies
    - Add trigger to automatically update reply counts
    - Add policies for thread access

  2. Security
    - Enable RLS for all new functions
    - Add policies to ensure users can only reply if they have access to parent message
*/

-- Add threading support to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES messages(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS reply_count integer DEFAULT 0;

-- Create index for faster thread queries
CREATE INDEX IF NOT EXISTS messages_parent_id_idx ON messages(parent_id);

-- Create function to update reply counts
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE messages
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE messages
    SET reply_count = reply_count - 1
    WHERE id = OLD.parent_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reply count updates
DROP TRIGGER IF EXISTS update_reply_count_trigger ON messages;
CREATE TRIGGER update_reply_count_trigger
  AFTER INSERT OR DELETE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_reply_count();

-- Add policy for thread replies
CREATE POLICY "Allow replies to accessible messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (
    parent_id IS NULL OR
    EXISTS (
      SELECT 1 FROM messages parent
      WHERE parent.id = parent_id
    )
  );