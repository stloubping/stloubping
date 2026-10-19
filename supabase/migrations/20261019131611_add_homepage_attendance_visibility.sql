-- Version aligned with the migration applied to the hosted project.
CREATE TABLE public.homepage_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  room_attendance_visible boolean NOT NULL DEFAULT false
);

ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.homepage_settings FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.homepage_settings TO anon, authenticated;
GRANT UPDATE (room_attendance_visible) ON public.homepage_settings TO authenticated;

CREATE POLICY "Anyone can read homepage visibility"
ON public.homepage_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Club admins can update homepage visibility"
ON public.homepage_settings FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = (SELECT auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = (SELECT auth.uid())));

INSERT INTO public.homepage_settings (id, room_attendance_visible) VALUES (true, false);
