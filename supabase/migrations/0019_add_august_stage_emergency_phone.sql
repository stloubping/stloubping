ALTER TABLE public.august_stage_registrations
  ADD COLUMN IF NOT EXISTS emergency_phone TEXT;

ALTER TABLE public.august_stage_registrations
  DROP CONSTRAINT IF EXISTS august_stage_emergency_phone_length;

ALTER TABLE public.august_stage_registrations
  ADD CONSTRAINT august_stage_emergency_phone_length
  CHECK (emergency_phone IS NULL OR char_length(trim(emergency_phone)) BETWEEN 6 AND 30);

COMMENT ON COLUMN public.august_stage_registrations.emergency_phone IS
  'Telephone a contacter en cas de probleme pendant le stage. Visible uniquement par les administrateurs.';