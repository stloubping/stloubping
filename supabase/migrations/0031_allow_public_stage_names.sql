CREATE POLICY "Public can view stage participant names"
  ON public.august_stage_registrations FOR SELECT TO anon USING (true);

GRANT SELECT (first_name, last_name)
  ON public.august_stage_registrations TO anon;
