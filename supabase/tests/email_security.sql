-- Integration checks: create only disposable example.invalid data, then roll back everything.
BEGIN;
DO $tests$
BEGIN
  IF has_column_privilege('anon', 'public.stage_registrations', 'emergency_phone', 'SELECT')
    OR has_column_privilege('anon', 'public.stage_registrations', 'paid', 'SELECT') THEN
    RAISE EXCEPTION 'Private stage data is still public';
  END IF;
  IF NOT has_column_privilege('anon', 'public.stage_registrations', 'first_name', 'SELECT') THEN
    RAISE EXCEPTION 'Public stage names no longer readable';
  END IF;
  IF has_function_privilege('anon', 'public.claim_club_email_notification(text,uuid)', 'EXECUTE')
    OR has_function_privilege('authenticated', 'public.claim_club_email_notification(text,uuid)', 'EXECUTE')
    OR has_table_privilege('anon', 'public.email_notification_deliveries', 'SELECT') THEN
    RAISE EXCEPTION 'Public email dispatch permissions too broad';
  END IF;
  IF NOT has_function_privilege('service_role', 'public.claim_club_email_notification(text,uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Email service cannot claim deliveries';
  END IF;
END;
$tests$;
SET LOCAL ROLE service_role;
DO $tests$
DECLARE
  test_record_id uuid := gen_random_uuid();
  response jsonb;
  queue_count integer;
BEGIN
  INSERT INTO public.trial_requests (id, request_type, first_name, age, profile, level, phone, email, consent, website)
    VALUES (test_record_id, 'trial', 'Security integration check', 18, 'adulte-loisir', 'test', '0000000000',
      'security-' || test_record_id::text || '@example.invalid', true, '');
  SELECT count(*) INTO queue_count FROM public.email_notification_deliveries
    WHERE notification_kind = 'trial' AND email_notification_deliveries.record_id = test_record_id;
  IF queue_count <> 1 THEN RAISE EXCEPTION 'Submission not queued'; END IF;
  response := public.claim_club_email_notification('trial', test_record_id);
  IF response->>'status' <> 'claimed' OR response->'record'->>'id' <> test_record_id::text THEN
    RAISE EXCEPTION 'Valid submission not claimed';
  END IF;
  response := public.claim_club_email_notification('trial', test_record_id);
  IF response->>'status' <> 'busy' THEN RAISE EXCEPTION 'Concurrent duplicate was not blocked'; END IF;
  UPDATE public.email_notification_deliveries SET status = 'sent', sent_at = now()
    WHERE notification_kind = 'trial' AND email_notification_deliveries.record_id = test_record_id;
  response := public.claim_club_email_notification('trial', test_record_id);
  IF response->>'status' <> 'already_sent' THEN RAISE EXCEPTION 'Replay was not blocked'; END IF;
  UPDATE public.email_notification_deliveries SET status = 'failed', lease_until = null
    WHERE notification_kind = 'trial' AND email_notification_deliveries.record_id = test_record_id;
  response := public.claim_club_email_notification('trial', test_record_id);
  IF response->>'status' <> 'rate_limited' THEN RAISE EXCEPTION 'Cooldown not enforced'; END IF;
  UPDATE public.email_notification_deliveries SET last_attempt_at = now() - interval '31 seconds', attempt_count = 3
    WHERE notification_kind = 'trial' AND email_notification_deliveries.record_id = test_record_id;
  response := public.claim_club_email_notification('trial', test_record_id);
  IF response->>'status' <> 'rate_limited' THEN RAISE EXCEPTION 'Attempt limit not enforced'; END IF;
  response := public.claim_club_email_notification('trial', gen_random_uuid());
  IF response->>'status' <> 'not_found' THEN RAISE EXCEPTION 'Unknown submission accepted'; END IF;
END;
$tests$;
ROLLBACK;
