ALTER TABLE public.weekly_room_attendance
ADD COLUMN IF NOT EXISTS has_keys BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE VIEW public.weekly_room_attendance_counts AS
SELECT
  room_day.attendance_date,
  room_day.is_open,
  COUNT(attendance.id)::INTEGER AS player_count,
  COUNT(attendance.id) FILTER (WHERE attendance.has_keys)::INTEGER AS key_holder_count
FROM public.weekly_room_days AS room_day
LEFT JOIN public.weekly_room_attendance AS attendance
  ON attendance.attendance_date = room_day.attendance_date
GROUP BY room_day.attendance_date, room_day.is_open;

GRANT SELECT ON public.weekly_room_attendance_counts TO anon, authenticated;
