-- Les inscriptions du stage contiennent des données personnelles.
-- La page publique peut uniquement créer une inscription ; seules les politiques
-- d'administration autorisent la lecture et la modification.
DROP POLICY IF EXISTS "Public can view August stage registrations"
  ON public.august_stage_registrations;

REVOKE SELECT ON TABLE public.august_stage_registrations FROM anon;
REVOKE ALL ON TABLE public.august_stage_registrations FROM anon;

GRANT INSERT (
  first_name,
  last_name,
  emergency_phone,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday
) ON TABLE public.august_stage_registrations TO anon;
