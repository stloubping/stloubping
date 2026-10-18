BEGIN;
WITH test_stage AS (
  INSERT INTO public.stages (id, name, slug, capacity)
  VALUES (gen_random_uuid(), 'Security capacity check', 'security-' || gen_random_uuid()::text, 1)
  RETURNING id
)
SELECT set_config('app.security_test_stage_id', id::text, true) FROM test_stage;
SET LOCAL ROLE anon;
INSERT INTO public.stage_registrations (stage_id, first_name, last_name, emergency_phone, monday)
VALUES (current_setting('app.security_test_stage_id')::uuid, 'Security', 'Check', '0000000000', true);
DO $tests$
DECLARE
  actual_count integer;
BEGIN
  SELECT count(*) INTO actual_count FROM public.stage_registrations
    WHERE stage_id = current_setting('app.security_test_stage_id')::uuid;
  IF actual_count <> 1 THEN RAISE EXCEPTION 'Public registration or count failed'; END IF;
  BEGIN
    INSERT INTO public.stage_registrations (stage_id, first_name, last_name, emergency_phone, monday)
    VALUES (current_setting('app.security_test_stage_id')::uuid, 'Security', 'Check 2', '0000000000', true);
    RAISE EXCEPTION 'Capacity check did not reject the second registration';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;
  BEGIN
    PERFORM emergency_phone FROM public.stage_registrations LIMIT 1;
    RAISE EXCEPTION 'Anonymous phone read was allowed';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
END;
$tests$;
ROLLBACK;
