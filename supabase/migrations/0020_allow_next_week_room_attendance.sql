CREATE OR REPLACE FUNCTION public.set_weekly_room_attendance(
  p_attendance_date DATE,
  p_visitor_token UUID,
  p_attending BOOLEAN,
  p_has_keys BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_week_start DATE := date_trunc('week', timezone('Europe/Paris', NOW()) - INTERVAL '1 hour')::DATE;
BEGIN
  IF p_attendance_date NOT BETWEEN current_week_start AND (current_week_start + 13) THEN
    RAISE EXCEPTION 'La date doit appartenir a la semaine en cours ou a la semaine suivante';
  END IF;

  IF p_attending = FALSE THEN
    DELETE FROM public.weekly_room_attendance
    WHERE attendance_date = p_attendance_date
      AND visitor_token = p_visitor_token;
    RETURN;
  END IF;

  INSERT INTO public.weekly_room_days (attendance_date, is_open, updated_at)
  VALUES (p_attendance_date, TRUE, NOW())
  ON CONFLICT (attendance_date) DO NOTHING;

  IF NOT EXISTS (
    SELECT 1 FROM public.weekly_room_days
    WHERE attendance_date = p_attendance_date AND is_open = TRUE
  ) THEN
    RAISE EXCEPTION 'La salle est fermee ce jour';
  END IF;

  INSERT INTO public.weekly_room_attendance (attendance_date, visitor_token, has_keys)
  VALUES (p_attendance_date, p_visitor_token, p_has_keys)
  ON CONFLICT (attendance_date, visitor_token)
  DO UPDATE SET has_keys = EXCLUDED.has_keys;
END;
$$;

REVOKE ALL ON FUNCTION public.set_weekly_room_attendance(DATE, UUID, BOOLEAN, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_weekly_room_attendance(DATE, UUID, BOOLEAN, BOOLEAN) TO anon, authenticated;