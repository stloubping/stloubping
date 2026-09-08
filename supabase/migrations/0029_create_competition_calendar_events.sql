CREATE TABLE IF NOT EXISTS public.competition_calendar_events (
  id text PRIMARY KEY,
  date date NOT NULL,
  end_date date,
  title text NOT NULL,
  category text NOT NULL,
  phase text,
  location text,
  details text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.competition_calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read competition calendar" ON public.competition_calendar_events;
CREATE POLICY "Anyone can read competition calendar"
  ON public.competition_calendar_events FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Club admins manage competition calendar" ON public.competition_calendar_events;
CREATE POLICY "Club admins manage competition calendar"
  ON public.competition_calendar_events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));

GRANT SELECT ON public.competition_calendar_events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.competition_calendar_events TO authenticated;
