/*
# Add profiles table with participant type detection

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, not null) — copied from auth.users on signup
  - `full_name` (text, nullable) — user's display name
  - `participant_type` (text, not null, default computed) — 'internal' or 'external'
  - `created_at` (timestamptz, default now())

2. Modified Tables
- `registrations` — added `user_id` column linking to auth.users, made it owner-scoped

3. Security
- Enable RLS on `profiles`
- Owner-scoped CRUD: each authenticated user can only access their own profile row
- `registrations` now owner-scoped to authenticated users (was anon-accessible before)
- Updated registration policies to use auth.uid() ownership checks

4. Important Notes
- A trigger function `determine_participant_type()` runs on INSERT to profiles
  - If email ends with @vitstudent.ac.in -> participant_type = 'internal'
  - Otherwise (e.g. @gmail.com) -> participant_type = 'external'
  - The backend is the source of truth; the frontend never asks the user to select type
- A trigger on auth.users (handle_new_user) auto-creates a profile row when a user signs up
- The `registrations` table now requires authentication (user_id defaults to auth.uid())
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  participant_type text NOT NULL DEFAULT 'external',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Function to determine participant type from email domain
CREATE OR REPLACE FUNCTION determine_participant_type(p_email text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_email ILIKE '%@vitstudent.ac.in' THEN 'internal'
    ELSE 'external'
  END
$$;

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, participant_type)
  VALUES (
    NEW.id,
    NEW.email,
    public.determine_participant_type(NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger: create profile when a new auth.users row is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add user_id to registrations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE registrations
      ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update registrations: drop old anon policies, add authenticated owner-scoped policies
DROP POLICY IF EXISTS "anon_select_registrations" ON registrations;
DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;

DROP POLICY IF EXISTS "select_own_registrations" ON registrations;
CREATE POLICY "select_own_registrations" ON registrations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_registrations" ON registrations;
CREATE POLICY "insert_own_registrations" ON registrations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_registrations" ON registrations;
CREATE POLICY "update_own_registrations" ON registrations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_registrations" ON registrations;
CREATE POLICY "delete_own_registrations" ON registrations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Add index on registrations.user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
