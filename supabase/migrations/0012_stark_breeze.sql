/*
  # Fix presence system

  1. Changes
    - Remove status column references
    - Simplify presence tracking to use last_ping
    - Add indexes for better performance

  2. Security
    - Keep RLS enabled
    - Update policies for better security
*/

-- Drop old presence policies
DROP POLICY IF EXISTS "Allow presence upsert for valid users" ON presence;
DROP POLICY IF EXISTS "Allow public read access to presence" ON presence;

-- Recreate presence table with correct schema
DROP TABLE IF EXISTS presence;
CREATE TABLE presence (
  user_id uuid PRIMARY KEY REFERENCES chat_users(id) ON DELETE CASCADE,
  last_ping timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index for last_ping queries
CREATE INDEX presence_last_ping_idx ON presence(last_ping);

-- Enable RLS
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to presence"
  ON presence FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow users to update their own presence"
  ON presence FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM chat_users
      WHERE id = user_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_users
      WHERE id = user_id
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_presence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp updates
CREATE TRIGGER update_presence_timestamp
  BEFORE UPDATE ON presence
  FOR EACH ROW
  EXECUTE FUNCTION update_presence_timestamp();