BEGIN;
SELECT set_config('test.daily_stage', gen_random_uuid()::text, true);
SELECT set_config('test.other_stage', gen_random_uuid()::text, true);
INSERT INTO public.stages(id,name,slug,capacity) VALUES
  (current_setting('test.daily_stage')::uuid,'Daily capacity test','daily-test-' || current_setting('test.daily_stage'),1),
  (current_setting('test.other_stage')::uuid,'Other capacity test','daily-test-' || current_setting('test.other_stage'),1);

SET LOCAL ROLE anon;
INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,monday)
VALUES(current_setting('test.daily_stage')::uuid,'Monday','Capacity test','0000000000',true);
INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,tuesday)
VALUES(current_setting('test.daily_stage')::uuid,'Tuesday','Capacity test','0000000000',true);
INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,tuesday)
VALUES(current_setting('test.other_stage')::uuid,'Other','Capacity test','0000000000',true);
DO $$
BEGIN
  BEGIN
    INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,monday)
    VALUES(current_setting('test.daily_stage')::uuid,'Rejected','Capacity test','0000000000',true);
    RAISE EXCEPTION 'Full Monday was accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,tuesday,wednesday)
    VALUES(current_setting('test.daily_stage')::uuid,'Rejected multi','Capacity test','0000000000',true,true);
    RAISE EXCEPTION 'Full Tuesday was accepted in a multi-day request';
  EXCEPTION WHEN check_violation THEN NULL; END;
  IF (SELECT wednesday FROM public.stage_daily_counts WHERE stage_id=current_setting('test.daily_stage')::uuid) <> 0 THEN
    RAISE EXCEPTION 'Part of a rejected multi-day registration was saved'; END IF;
  BEGIN
    INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,friday) VALUES
      (current_setting('test.daily_stage')::uuid,'Batch one','Capacity test','0000000000',true),
      (current_setting('test.daily_stage')::uuid,'Batch two','Capacity test','0000000000',true);
    RAISE EXCEPTION 'A multi-row insert bypassed capacity';
  EXCEPTION WHEN check_violation THEN NULL; END;
  IF (SELECT friday FROM public.stage_daily_counts WHERE stage_id=current_setting('test.daily_stage')::uuid) <> 0 THEN
    RAISE EXCEPTION 'Rejected batch was partially saved'; END IF;
  IF has_column_privilege('anon','public.stage_registrations','monday','SELECT')
    OR has_column_privilege('anon','public.stage_registrations','emergency_phone','SELECT') THEN
    RAISE EXCEPTION 'Private individual data became public'; END IF;
END $$;

RESET ROLE;
SET LOCAL request.jwt.claim.sub='00000000-0000-0000-0000-000000000000';
SET LOCAL ROLE authenticated;
INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,wednesday)
VALUES(current_setting('test.daily_stage')::uuid,'Wednesday','Capacity test','0000000000',true);
DO $$
BEGIN
  BEGIN
    INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,monday)
    VALUES(current_setting('test.daily_stage')::uuid,'Rejected member','Capacity test','0000000000',true);
    RAISE EXCEPTION 'A non-admin bypassed the capacity through RLS-filtered counts';
  EXCEPTION WHEN check_violation THEN NULL; END;
END $$;

RESET ROLE;
SELECT set_config('request.jwt.claim.sub',user_id::text,true) FROM public.club_admins LIMIT 1;
SET LOCAL ROLE authenticated;
UPDATE public.stage_registrations SET monday=true
WHERE stage_id=current_setting('test.daily_stage')::uuid AND first_name='Monday';
DO $$
BEGIN
  BEGIN
    UPDATE public.stage_registrations SET monday=true
    WHERE stage_id=current_setting('test.daily_stage')::uuid AND first_name='Tuesday';
    RAISE EXCEPTION 'An admin added a player to a full day';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    UPDATE public.stage_registrations SET stage_id=current_setting('test.other_stage')::uuid
    WHERE stage_id=current_setting('test.daily_stage')::uuid AND first_name='Tuesday';
    RAISE EXCEPTION 'Moving a registration bypassed capacity';
  EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
UPDATE public.stage_registrations SET monday=false,thursday=true
WHERE stage_id=current_setting('test.daily_stage')::uuid AND first_name='Monday';
UPDATE public.stage_registrations SET monday=true
WHERE stage_id=current_setting('test.daily_stage')::uuid AND first_name='Wednesday';
UPDATE public.stage_registrations SET paid=true
WHERE stage_id=current_setting('test.daily_stage')::uuid AND first_name='Wednesday';

RESET ROLE;
UPDATE public.stages SET capacity=null WHERE id=current_setting('test.daily_stage')::uuid;
SET LOCAL ROLE anon;
INSERT INTO public.stage_registrations(stage_id,first_name,last_name,emergency_phone,monday)
VALUES(current_setting('test.daily_stage')::uuid,'Unlimited','Capacity test','0000000000',true);

-- Legacy August stage: test only additions, never delete or modify real registrations.
RESET ROLE;
UPDATE public.stages s SET capacity=c.monday+1
FROM public.stage_daily_counts c WHERE c.stage_id=s.id AND s.slug='stage-aout';
SET LOCAL ROLE anon;
INSERT INTO public.august_stage_registrations(first_name,last_name,emergency_phone,monday)
VALUES('Capacity test','Rollback only','0000000000',true);
DO $$
BEGIN
  BEGIN
    INSERT INTO public.august_stage_registrations(first_name,last_name,emergency_phone,monday)
    VALUES('Rejected','Rollback only','0000000000',true);
    RAISE EXCEPTION 'August Monday was not limited';
  EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
RESET ROLE;
SELECT 'OK: daily limits, inserts, admin updates, moves, unlimited and legacy; all test data rolled back' AS result;
ROLLBACK;
