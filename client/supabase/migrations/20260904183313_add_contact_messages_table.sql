/*
# Add contact_messages table

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `email` (text, not null)
  - `message` (text, not null)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `contact_messages`
- Allow anon + authenticated INSERT (public contact form, no sign-in needed)
- Allow authenticated SELECT (for admins to read messages)
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);
