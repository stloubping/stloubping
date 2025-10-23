-- Drop the existing policy
DROP POLICY IF EXISTS "Allow authenticated users to insert registrations" ON public.tournament_registrations;

-- Create a new policy to allow anonymous users to insert registrations
CREATE POLICY "Allow anonymous users to insert registrations" ON public.tournament_registrations
FOR INSERT TO anon WITH CHECK (true);