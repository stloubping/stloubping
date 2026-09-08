CREATE TABLE IF NOT EXISTS public.stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  slug text NOT NULL UNIQUE CHECK (char_length(trim(slug)) BETWEEN 1 AND 140),
  start_date date,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read stages" ON public.stages;
CREATE POLICY "Anyone can read stages" ON public.stages FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Club admins manage stages" ON public.stages;
CREATE POLICY "Club admins manage stages" ON public.stages FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));

GRANT SELECT ON public.stages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.stages TO authenticated;

INSERT INTO public.stages (name, slug, start_date, end_date)
VALUES ('Stage août', 'stage-aout', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;
