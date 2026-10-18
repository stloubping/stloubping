-- Keep the public names list; private registration columns remain admin-only.
REVOKE ALL PRIVILEGES ON TABLE public.stage_registrations FROM anon, PUBLIC;
REVOKE SELECT (id, stage_id, first_name, last_name, emergency_phone, monday, tuesday, wednesday, thursday, friday, paid, created_at)
  ON public.stage_registrations FROM anon, PUBLIC;
GRANT SELECT (stage_id, first_name, last_name) ON public.stage_registrations TO anon;
GRANT INSERT (stage_id, first_name, last_name, emergency_phone, monday, tuesday, wednesday, thursday, friday)
  ON public.stage_registrations TO anon;
-- RLS still restricts authenticated users' full SELECT to club administrators.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stage_registrations TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.august_stage_registrations FROM anon, PUBLIC;
REVOKE SELECT (id, first_name, last_name, emergency_phone, monday, tuesday, wednesday, thursday, friday, paid, created_at)
  ON public.august_stage_registrations FROM anon, PUBLIC;
GRANT SELECT (first_name, last_name) ON public.august_stage_registrations TO anon;
GRANT INSERT (first_name, last_name, emergency_phone, monday, tuesday, wednesday, thursday, friday)
  ON public.august_stage_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.august_stage_registrations TO authenticated;
NOTIFY pgrst, 'reload schema';
