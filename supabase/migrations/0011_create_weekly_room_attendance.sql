CREATE TABLE IF NOT EXISTS public.weekly_room_days (
  attendance_date DATE PRIMARY KEY,
  is_open BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.weekly_room_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_date DATE NOT NULL REFERENCES public.weekly_room_days(attendance_date) ON DELETE CASCADE,
  visitor_token UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (attendance_date, visitor_token)
);

ALTER TABLE public.weekly_room_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_room_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read room opening days"
ON public.weekly_room_days FOR SELECT TO anon, authenticated
USING (TRUE);

CREATE POLICY "Club admins can manage room opening days"
ON public.weekly_room_days FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()
));

CREATE POLICY "Public can register anonymous attendance"
ON public.weekly_room_attendance FOR INSERT TO anon, authenticated
WITH CHECK (
  attendance_date BETWEEN date_trunc('week', CURRENT_DATE)::DATE
    AND (date_trunc('week', CURRENT_DATE)::DATE + 6)
  AND EXISTS (
    SELECT 1
    FROM public.weekly_room_days
    WHERE weekly_room_days.attendance_date = weekly_room_attendance.attendance_date
      AND weekly_room_days.is_open = TRUE
  )
);

CREATE POLICY "Club admins can read room attendance"
ON public.weekly_room_attendance FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()
));

CREATE POLICY "Club admins can clear room attendance"
ON public.weekly_room_attendance FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()
));

GRANT SELECT ON public.weekly_room_days TO anon, authenticated;
GRANT INSERT ON public.weekly_room_attendance TO anon, authenticated;
GRANT SELECT, DELETE ON public.weekly_room_attendance TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.weekly_room_days TO authenticated;

CREATE OR REPLACE VIEW public.weekly_room_attendance_counts AS
SELECT
  room_day.attendance_date,
  room_day.is_open,
  COUNT(attendance.id)::INTEGER AS player_count
FROM public.weekly_room_days AS room_day
LEFT JOIN public.weekly_room_attendance AS attendance
  ON attendance.attendance_date = room_day.attendance_date
GROUP BY room_day.attendance_date, room_day.is_open;

GRANT SELECT ON public.weekly_room_attendance_counts TO anon, authenticated;
