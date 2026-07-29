DROP POLICY IF EXISTS "Club admins can read all shop preorders" ON public.shop_preorders;
DROP POLICY IF EXISTS "Club admins can update shop preorders" ON public.shop_preorders;

CREATE POLICY "Club admins can read all shop preorders"
ON public.shop_preorders FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.club_admins
  WHERE club_admins.user_id = auth.uid()
));

CREATE POLICY "Club admins can update shop preorders"
ON public.shop_preorders FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.club_admins
  WHERE club_admins.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.club_admins
  WHERE club_admins.user_id = auth.uid()
));

GRANT SELECT, UPDATE ON TABLE public.shop_preorders TO authenticated;