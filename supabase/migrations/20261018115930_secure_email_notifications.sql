-- Only the trusted email functions can read or claim these deliveries.
CREATE TABLE public.email_notification_deliveries (
  notification_kind text NOT NULL CHECK (notification_kind IN ('tournament', 'trial', 'equipment')),
  record_id uuid NOT NULL,
  recipient_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
  attempt_count integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  claim_token uuid,
  lease_until timestamptz,
  sent_at timestamptz,
  PRIMARY KEY (notification_kind, record_id)
);
ALTER TABLE public.email_notification_deliveries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.email_notification_deliveries FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.email_notification_deliveries TO service_role;
CREATE INDEX email_notification_attempts_idx ON public.email_notification_deliveries (last_attempt_at);
CREATE INDEX email_notification_recipient_idx ON public.email_notification_deliveries (recipient_hash, last_attempt_at);

CREATE FUNCTION public.queue_club_email_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  kind text;
BEGIN
  kind := CASE TG_TABLE_NAME
    WHEN 'tournament_registrations' THEN 'tournament'
    WHEN 'trial_requests' THEN 'trial'
    WHEN 'equipment_orders' THEN 'equipment'
    ELSE NULL
  END;
  IF TG_TABLE_SCHEMA <> 'public' OR kind IS NULL THEN
    RAISE EXCEPTION 'Unsupported email source';
  END IF;
  IF NEW.consent IS TRUE AND coalesce(NEW.website, '') = '' THEN
    INSERT INTO public.email_notification_deliveries (notification_kind, record_id, recipient_hash)
    VALUES (kind, NEW.id, md5(lower(trim(NEW.email))))
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.queue_club_email_notification() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER queue_tournament_confirmation AFTER INSERT ON public.tournament_registrations
  FOR EACH ROW EXECUTE FUNCTION public.queue_club_email_notification();
CREATE TRIGGER queue_trial_notification AFTER INSERT ON public.trial_requests
  FOR EACH ROW EXECUTE FUNCTION public.queue_club_email_notification();
CREATE TRIGGER queue_equipment_confirmation AFTER INSERT ON public.equipment_orders
  FOR EACH ROW EXECUTE FUNCTION public.queue_club_email_notification();

-- SECURITY INVOKER: only service_role is granted EXECUTE. No public RPC bypass.
CREATE FUNCTION public.claim_club_email_notification(p_kind text, p_record_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  delivery public.email_notification_deliveries%ROWTYPE;
  record_json jsonb;
  token uuid;
  recent_attempts bigint;
BEGIN
  IF p_kind NOT IN ('tournament', 'trial', 'equipment') THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;
  -- Serialize quota and claim decisions, including concurrent duplicate requests.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('club-email-dispatch'));
  SELECT * INTO delivery FROM public.email_notification_deliveries
    WHERE notification_kind = p_kind AND record_id = p_record_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;
  IF delivery.status = 'sent' THEN
    RETURN jsonb_build_object('status', 'already_sent');
  END IF;
  IF delivery.created_at < now() - interval '24 hours' THEN
    RETURN jsonb_build_object('status', 'expired');
  END IF;
  IF delivery.status = 'sending' AND delivery.lease_until > now() THEN
    RETURN jsonb_build_object('status', 'busy');
  END IF;
  IF delivery.attempt_count >= 3 OR delivery.last_attempt_at > now() - interval '30 seconds' THEN
    RETURN jsonb_build_object('status', 'rate_limited');
  END IF;
  SELECT coalesce(sum(attempt_count), 0) INTO recent_attempts
    FROM public.email_notification_deliveries WHERE last_attempt_at > now() - interval '1 hour';
  IF recent_attempts >= 120 THEN
    RETURN jsonb_build_object('status', 'rate_limited');
  END IF;
  SELECT coalesce(sum(attempt_count), 0) INTO recent_attempts
    FROM public.email_notification_deliveries
    WHERE recipient_hash = delivery.recipient_hash AND last_attempt_at > now() - interval '1 hour';
  IF recent_attempts >= 3 THEN
    RETURN jsonb_build_object('status', 'rate_limited');
  END IF;

  CASE p_kind
    WHEN 'tournament' THEN
      SELECT to_jsonb(r) INTO record_json FROM public.tournament_registrations r
        WHERE r.id = p_record_id AND r.consent IS TRUE AND r.website = '';
    WHEN 'trial' THEN
      SELECT to_jsonb(r) INTO record_json FROM public.trial_requests r
        WHERE r.id = p_record_id AND r.consent IS TRUE AND r.website = '' AND r.status = 'received';
    WHEN 'equipment' THEN
      SELECT to_jsonb(r) INTO record_json FROM public.equipment_orders r
        WHERE r.id = p_record_id AND r.consent IS TRUE AND r.website = '' AND r.status <> 'cancelled';
  END CASE;
  IF record_json IS NULL OR lower(trim(record_json->>'email')) IS NULL
    OR md5(lower(trim(record_json->>'email'))) <> delivery.recipient_hash THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;
  token := gen_random_uuid();
  UPDATE public.email_notification_deliveries
    SET status = 'sending', attempt_count = attempt_count + 1, last_attempt_at = now(),
        claim_token = token, lease_until = now() + interval '2 minutes'
    WHERE notification_kind = p_kind AND record_id = p_record_id;
  RETURN jsonb_build_object('status', 'claimed', 'claim_token', token, 'record', record_json);
END;
$$;
REVOKE ALL ON FUNCTION public.claim_club_email_notification(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_club_email_notification(text, uuid) TO service_role;

-- Internal-only lookup used to keep old browser tabs working during deployment.
CREATE FUNCTION public.find_recent_club_email_record(p_kind text, p_email text, p_first_name text, p_last_name text DEFAULT NULL, p_request_type text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  result uuid;
BEGIN
  IF p_kind = 'tournament' THEN
    SELECT r.id INTO result FROM public.tournament_registrations r
      JOIN public.email_notification_deliveries d ON d.record_id = r.id AND d.notification_kind = 'tournament'
      WHERE lower(r.email) = lower(p_email) AND r.first_name = p_first_name AND r.last_name = p_last_name
        AND d.created_at > now() - interval '15 minutes'
      ORDER BY d.created_at DESC LIMIT 1;
  ELSIF p_kind = 'trial' THEN
    SELECT r.id INTO result FROM public.trial_requests r
      JOIN public.email_notification_deliveries d ON d.record_id = r.id AND d.notification_kind = 'trial'
      WHERE lower(r.email) = lower(p_email) AND r.first_name = p_first_name AND r.request_type = p_request_type
        AND d.created_at > now() - interval '15 minutes'
      ORDER BY d.created_at DESC LIMIT 1;
  END IF;
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.find_recent_club_email_record(text, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.find_recent_club_email_record(text, text, text, text, text) TO service_role;
NOTIFY pgrst, 'reload schema';
