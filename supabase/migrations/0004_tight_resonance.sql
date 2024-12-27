/*
  # Add indexes and constraints for messages

  1. Changes
    - Add index on created_at for faster message retrieval
    - Add cascade delete for user messages
    - Add NOT NULL constraint on content
*/

-- Add index for faster message retrieval
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);

-- Add cascade delete for user messages
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_user_id_fkey,
ADD CONSTRAINT messages_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES chat_users(id) 
  ON DELETE CASCADE;

-- Ensure content is not null
ALTER TABLE messages 
ALTER COLUMN content SET NOT NULL;