CREATE POLICY "Allow anonymous users to select registrations" ON public.tournament_registrations
FOR SELECT TO anon USING (true);