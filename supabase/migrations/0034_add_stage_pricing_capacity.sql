ALTER TABLE public.stages
  ADD COLUMN IF NOT EXISTS daily_price numeric(8,2) NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS package_price numeric(8,2) NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS capacity integer;

ALTER TABLE public.stages
  DROP CONSTRAINT IF EXISTS stages_daily_price_nonnegative,
  DROP CONSTRAINT IF EXISTS stages_package_price_nonnegative,
  DROP CONSTRAINT IF EXISTS stages_capacity_positive;

ALTER TABLE public.stages
  ADD CONSTRAINT stages_daily_price_nonnegative CHECK (daily_price >= 0),
  ADD CONSTRAINT stages_package_price_nonnegative CHECK (package_price >= 0),
  ADD CONSTRAINT stages_capacity_positive CHECK (capacity IS NULL OR capacity > 0);

CREATE OR REPLACE FUNCTION public.enforce_stage_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  stage_capacity integer;
  registered_count integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(NEW.stage_id::text));
  SELECT capacity INTO stage_capacity FROM public.stages WHERE id = NEW.stage_id;
  IF stage_capacity IS NOT NULL THEN
    SELECT count(*) INTO registered_count FROM public.stage_registrations WHERE stage_id = NEW.stage_id;
    IF registered_count >= stage_capacity THEN
      RAISE EXCEPTION 'Ce stage est complet (% places).', stage_capacity USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stage_registrations_capacity ON public.stage_registrations;
CREATE TRIGGER stage_registrations_capacity
  BEFORE INSERT ON public.stage_registrations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_stage_capacity();

CREATE OR REPLACE FUNCTION public.enforce_august_stage_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  stage_capacity integer;
  registered_count integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('stage-aout'));
  SELECT capacity INTO stage_capacity FROM public.stages WHERE slug = 'stage-aout';
  IF stage_capacity IS NOT NULL THEN
    SELECT count(*) INTO registered_count FROM public.august_stage_registrations;
    IF registered_count >= stage_capacity THEN
      RAISE EXCEPTION 'Ce stage est complet (% places).', stage_capacity USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS august_stage_registrations_capacity ON public.august_stage_registrations;
CREATE TRIGGER august_stage_registrations_capacity
  BEFORE INSERT ON public.august_stage_registrations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_august_stage_capacity();
