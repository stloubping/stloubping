-- Create tournament_registrations table
CREATE TABLE public.tournament_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  licence_number TEXT NOT NULL,
  club TEXT NOT NULL,
  selected_tableaux JSONB NOT NULL, -- Stores an array of selected tableau IDs
  doubles_partner TEXT,
  consent BOOLEAN NOT NULL
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert new registrations
-- Note: For a public tournament registration, you might want to allow anonymous inserts.
-- However, for security best practices, it's often better to require authentication
-- if possible, or carefully consider the implications of anonymous inserts.
-- For now, we'll keep it for 'authenticated' users. If you need anonymous, let me know.
CREATE POLICY "Allow authenticated users to insert registrations" ON public.tournament_registrations
FOR INSERT TO authenticated WITH CHECK (true);

-- For now, we will keep SELECT, UPDATE, DELETE restricted.
-- If you need to allow users to view/edit their own registrations,
-- you would need to add a user_id column and corresponding policies.