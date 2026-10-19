BEGIN;

SET LOCAL ROLE anon;
DO $$
BEGIN
  IF (SELECT count(*) FROM public.homepage_settings) <> 1 THEN
    RAISE EXCEPTION 'Le réglage doit être lisible publiquement';
  END IF;
  BEGIN
    UPDATE public.homepage_settings SET room_attendance_visible = true;
    RAISE EXCEPTION 'Un visiteur ne doit pas modifier le réglage';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;

RESET ROLE;
SET LOCAL request.jwt.claim.sub = '00000000-0000-0000-0000-000000000000';
SET LOCAL ROLE authenticated;
DO $$
DECLARE affected integer;
BEGIN
  UPDATE public.homepage_settings SET room_attendance_visible = true WHERE id = true;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Un membre non administrateur ne doit pas modifier le réglage'; END IF;
END $$;

RESET ROLE;
SELECT set_config('request.jwt.claim.sub', user_id::text, true) FROM public.club_admins LIMIT 1;
SET LOCAL ROLE authenticated;
DO $$
DECLARE affected integer;
BEGIN
  UPDATE public.homepage_settings SET room_attendance_visible = NOT room_attendance_visible WHERE id = true;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 THEN RAISE EXCEPTION 'L’administrateur doit pouvoir modifier le réglage'; END IF;
  UPDATE public.competition_calendar_events SET date = date + 1 WHERE id = 'cg-j1';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 THEN RAISE EXCEPTION 'L’administrateur doit pouvoir modifier une date'; END IF;
END $$;

ROLLBACK;
