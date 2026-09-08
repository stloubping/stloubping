CREATE TABLE IF NOT EXISTS public.stage_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id uuid NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  first_name text NOT NULL CHECK (char_length(trim(first_name)) BETWEEN 1 AND 80),
  last_name text NOT NULL CHECK (char_length(trim(last_name)) BETWEEN 1 AND 80),
  emergency_phone text NOT NULL CHECK (char_length(trim(emergency_phone)) BETWEEN 6 AND 30),
  monday boolean NOT NULL DEFAULT false,
  tuesday boolean NOT NULL DEFAULT false,
  wednesday boolean NOT NULL DEFAULT false,
  thursday boolean NOT NULL DEFAULT false,
  friday boolean NOT NULL DEFAULT false,
  paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stage_at_least_one_day CHECK (monday OR tuesday OR wednesday OR thursday OR friday)
);
ALTER TABLE public.stage_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can register for a stage" ON public.stage_registrations FOR INSERT TO anon, authenticated WITH CHECK (paid = false);
CREATE POLICY "Public can view stage names" ON public.stage_registrations FOR SELECT TO anon USING (true);
CREATE POLICY "Club admins manage stage registrations" ON public.stage_registrations FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));
GRANT INSERT (stage_id, first_name, last_name, emergency_phone, monday, tuesday, wednesday, thursday, friday) ON public.stage_registrations TO anon;
GRANT SELECT (stage_id, first_name, last_name) ON public.stage_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stage_registrations TO authenticated;
