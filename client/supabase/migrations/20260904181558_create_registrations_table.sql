/*
# Create registrations table for SENSORA 2.0 hackathon

1. New Tables
- `registrations`
  - `id` (uuid, primary key)
  - `team_name` (text, not null) — the team's chosen name
  - `leader_name` (text, not null) — team leader's full name
  - `leader_email` (text, not null) — team leader's email (unique, one registration per email)
  - `leader_phone` (text, not null) — team leader's phone number
  - `member2_name` (text, nullable) — optional second member
  - `member3_name` (text, nullable) — optional third member
  - `member4_name` (text, nullable) — optional fourth member
  - `track` (text, not null) — chosen focus area: IoT, AI, Healthcare Tech, or Embedded Systems
  - `project_idea` (text, nullable) — optional brief project idea
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `registrations`.
- Allow anon + authenticated INSERT (public registration form, no sign-in needed).
- Allow anon + authenticated SELECT (public list of registered teams).
- No UPDATE or DELETE — registrations are immutable once submitted.
3. Important Notes
- This is a single-tenant, no-auth app: anyone visiting the site can register.
- One registration per email enforced by a UNIQUE constraint.
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  leader_name text NOT NULL,
  leader_email text NOT NULL UNIQUE,
  leader_phone text NOT NULL,
  member2_name text,
  member3_name text,
  member4_name text,
  track text NOT NULL,
  project_idea text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_registrations" ON registrations;
CREATE POLICY "anon_select_registrations" ON registrations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations" ON registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);
