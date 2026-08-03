CREATE TABLE IF NOT EXISTS public.august_stage_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL CHECK (char_length(trim(first_name)) BETWEEN 1 AND 80),
  last_name TEXT NOT NULL CHECK (char_length(trim(last_name)) BETWEEN 1 AND 80),
  monday BOOLEAN NOT NULL DEFAULT FALSE,
  tuesday BOOLEAN NOT NULL DEFAULT FALSE,
  wednesday BOOLEAN NOT NULL DEFAULT FALSE,
  thursday BOOLEAN NOT NULL DEFAULT FALSE,
  friday BOOLEAN NOT NULL DEFAULT FALSE,
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT august_stage_at_least_one_day CHECK (monday OR tuesday OR wednesday OR thursday OR friday)
);
ALTER TABLE public.august_stage_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view August stage registrations" ON public.august_stage_registrations FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can register for August stage" ON public.august_stage_registrations FOR INSERT TO anon, authenticated WITH CHECK (paid = FALSE);
CREATE POLICY "Club admins can manage August stage registrations" ON public.august_stage_registrations FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));
GRANT SELECT (id, first_name, last_name, monday, tuesday, wednesday, thursday, friday, created_at), INSERT ON public.august_stage_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.august_stage_registrations TO authenticated;
