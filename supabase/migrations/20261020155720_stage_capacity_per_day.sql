-- Only aggregate counts are public; no individual attendance or emergency details.
CREATE VIEW public.stage_daily_counts WITH (security_barrier = true) AS
SELECT s.id AS stage_id,
  CASE WHEN s.slug = 'stage-aout' THEN a.monday ELSE coalesce(r.monday, 0) END AS monday,
  CASE WHEN s.slug = 'stage-aout' THEN a.tuesday ELSE coalesce(r.tuesday, 0) END AS tuesday,
  CASE WHEN s.slug = 'stage-aout' THEN a.wednesday ELSE coalesce(r.wednesday, 0) END AS wednesday,
  CASE WHEN s.slug = 'stage-aout' THEN a.thursday ELSE coalesce(r.thursday, 0) END AS thursday,
  CASE WHEN s.slug = 'stage-aout' THEN a.friday ELSE coalesce(r.friday, 0) END AS friday
FROM public.stages s
LEFT JOIN (
  SELECT stage_id, count(*) FILTER (WHERE r.monday) AS monday,
    count(*) FILTER (WHERE r.tuesday) AS tuesday,
    count(*) FILTER (WHERE r.wednesday) AS wednesday,
    count(*) FILTER (WHERE r.thursday) AS thursday,
    count(*) FILTER (WHERE r.friday) AS friday
  FROM public.stage_registrations r GROUP BY stage_id
) r ON r.stage_id = s.id
CROSS JOIN (
  SELECT count(*) FILTER (WHERE r.monday) AS monday,
    count(*) FILTER (WHERE r.tuesday) AS tuesday,
    count(*) FILTER (WHERE r.wednesday) AS wednesday,
    count(*) FILTER (WHERE r.thursday) AS thursday,
    count(*) FILTER (WHERE r.friday) AS friday
  FROM public.august_stage_registrations r
) a;
REVOKE ALL ON public.stage_daily_counts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.stage_daily_counts TO anon, authenticated;
COMMENT ON VIEW public.stage_daily_counts IS 'Intentionally public aggregate counts, computed by the view owner. Does not expose individual days, phone numbers or payments.';

CREATE OR REPLACE FUNCTION public.enforce_stage_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  stage_capacity integer;
  counts jsonb;
  day_key text;
  old_days jsonb := '{}'::jsonb;
  old_same_stage boolean := false;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(NEW.stage_id::text));
  SELECT s.capacity, to_jsonb(c) INTO stage_capacity, counts
  FROM public.stages s JOIN public.stage_daily_counts c ON c.stage_id = s.id
  WHERE s.id = NEW.stage_id;
  IF stage_capacity IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' THEN
    old_days := to_jsonb(OLD);
    old_same_stage := OLD.stage_id = NEW.stage_id;
  END IF;
  FOREACH day_key IN ARRAY ARRAY['monday','tuesday','wednesday','thursday','friday'] LOOP
    -- Existing seats may be retained, even after an administrator lowers capacity.
    IF (to_jsonb(NEW)->>day_key)::boolean
      AND NOT (old_same_stage AND coalesce((old_days->>day_key)::boolean, false))
      AND (counts->>day_key)::bigint >= stage_capacity THEN
      RAISE EXCEPTION 'Journée complète : % (limite : % joueurs par jour).',
        CASE day_key WHEN 'monday' THEN 'lundi' WHEN 'tuesday' THEN 'mardi'
          WHEN 'wednesday' THEN 'mercredi' WHEN 'thursday' THEN 'jeudi' ELSE 'vendredi' END,
        stage_capacity USING ERRCODE = '23514';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_stage_capacity() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.enforce_august_stage_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  stage_capacity integer;
  counts jsonb;
  day_key text;
  old_days jsonb := '{}'::jsonb;
  old_same_stage boolean := false;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('stage-aout'));
  SELECT s.capacity, to_jsonb(c) INTO stage_capacity, counts
  FROM public.stages s JOIN public.stage_daily_counts c ON c.stage_id = s.id
  WHERE s.slug = 'stage-aout';
  IF stage_capacity IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' THEN
    old_days := to_jsonb(OLD);
    old_same_stage := true;
  END IF;
  FOREACH day_key IN ARRAY ARRAY['monday','tuesday','wednesday','thursday','friday'] LOOP
    -- Existing seats may be retained, even after an administrator lowers capacity.
    IF (to_jsonb(NEW)->>day_key)::boolean
      AND NOT (old_same_stage AND coalesce((old_days->>day_key)::boolean, false))
      AND (counts->>day_key)::bigint >= stage_capacity THEN
      RAISE EXCEPTION 'Journée complète : % (limite : % joueurs par jour).',
        CASE day_key WHEN 'monday' THEN 'lundi' WHEN 'tuesday' THEN 'mardi'
          WHEN 'wednesday' THEN 'mercredi' WHEN 'thursday' THEN 'jeudi' ELSE 'vendredi' END,
        stage_capacity USING ERRCODE = '23514';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_august_stage_capacity() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS stage_registrations_capacity ON public.stage_registrations;
CREATE TRIGGER stage_registrations_capacity
BEFORE INSERT OR UPDATE OF stage_id, monday, tuesday, wednesday, thursday, friday ON public.stage_registrations
FOR EACH ROW EXECUTE FUNCTION public.enforce_stage_capacity();

DROP TRIGGER IF EXISTS august_stage_registrations_capacity ON public.august_stage_registrations;
CREATE TRIGGER august_stage_registrations_capacity
BEFORE INSERT OR UPDATE OF monday, tuesday, wednesday, thursday, friday ON public.august_stage_registrations
FOR EACH ROW EXECUTE FUNCTION public.enforce_august_stage_capacity();
