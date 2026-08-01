-- Secure public forms and expose only deliberately public registration data.
ALTER TABLE public.trial_requests
  ADD COLUMN IF NOT EXISTS website TEXT NOT NULL DEFAULT '';
ALTER TABLE public.shop_preorders
  ADD COLUMN IF NOT EXISTS website TEXT NOT NULL DEFAULT '';
ALTER TABLE public.equipment_orders
  ADD COLUMN IF NOT EXISTS website TEXT NOT NULL DEFAULT '';
ALTER TABLE public.tournament_registrations
  ADD COLUMN IF NOT EXISTS website TEXT NOT NULL DEFAULT '';
ALTER TABLE public.tournament_registrations
  ADD COLUMN IF NOT EXISTS points TEXT;

DROP POLICY IF EXISTS "Allow public trial request submissions" ON public.trial_requests;
CREATE POLICY "Allow public trial request submissions"
ON public.trial_requests FOR INSERT TO anon, authenticated
WITH CHECK (consent = TRUE AND status = 'received' AND char_length(website) = 0);

DROP POLICY IF EXISTS "Allow public shop preorder submissions" ON public.shop_preorders;
CREATE POLICY "Allow public shop preorder submissions"
ON public.shop_preorders FOR INSERT TO anon, authenticated
WITH CHECK (consent = TRUE AND status = 'received' AND char_length(website) = 0);
DROP POLICY IF EXISTS "Allow public reading of visible shop preorders" ON public.shop_preorders;
REVOKE SELECT ON TABLE public.shop_preorders FROM anon;

DROP POLICY IF EXISTS "Allow public equipment order submissions" ON public.equipment_orders;
CREATE POLICY "Allow public equipment order submissions"
ON public.equipment_orders FOR INSERT TO anon, authenticated
WITH CHECK (consent = TRUE AND status = 'received' AND char_length(website) = 0);

DROP POLICY IF EXISTS "Allow anonymous users to select registrations" ON public.tournament_registrations;
REVOKE SELECT ON TABLE public.tournament_registrations FROM anon;

CREATE POLICY "Club admins can read tournament registrations"
ON public.tournament_registrations FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.club_admins
  WHERE club_admins.user_id = auth.uid()
));
GRANT SELECT ON TABLE public.tournament_registrations TO authenticated;

CREATE OR REPLACE VIEW public.tournament_registrations_public AS
SELECT id, first_name, last_name, points, club, selected_tableaux, doubles_partner
FROM public.tournament_registrations
WHERE consent = TRUE;
GRANT SELECT ON public.tournament_registrations_public TO anon, authenticated;

-- A filled honeypot is rejected server-side. The email cooldown limits repeated accidental or automated submits.
CREATE OR REPLACE FUNCTION public.prevent_public_submission_burst()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  EXECUTE format(
    'SELECT count(*) FROM public.%I WHERE lower(email) = lower($1) AND created_at > now() - interval ''5 minutes''',
    TG_TABLE_NAME
  ) INTO recent_count USING NEW.email;
  IF recent_count > 0 THEN
    RAISE EXCEPTION 'Une demande a déjà été reçue récemment avec cette adresse e-mail.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trial_requests_public_rate_limit ON public.trial_requests;
CREATE TRIGGER trial_requests_public_rate_limit
BEFORE INSERT ON public.trial_requests
FOR EACH ROW EXECUTE FUNCTION public.prevent_public_submission_burst();
DROP TRIGGER IF EXISTS shop_preorders_public_rate_limit ON public.shop_preorders;
CREATE TRIGGER shop_preorders_public_rate_limit
BEFORE INSERT ON public.shop_preorders
FOR EACH ROW EXECUTE FUNCTION public.prevent_public_submission_burst();
DROP TRIGGER IF EXISTS equipment_orders_public_rate_limit ON public.equipment_orders;
CREATE TRIGGER equipment_orders_public_rate_limit
BEFORE INSERT ON public.equipment_orders
FOR EACH ROW EXECUTE FUNCTION public.prevent_public_submission_burst();
DROP TRIGGER IF EXISTS tournament_registrations_public_rate_limit ON public.tournament_registrations;
CREATE TRIGGER tournament_registrations_public_rate_limit
BEFORE INSERT ON public.tournament_registrations
FOR EACH ROW EXECUTE FUNCTION public.prevent_public_submission_burst();
