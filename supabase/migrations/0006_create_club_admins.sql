CREATE TABLE IF NOT EXISTS public.club_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.club_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Club administrators can read their own access"
ON public.club_admins FOR SELECT TO authenticated
USING (user_id = auth.uid());

GRANT SELECT ON TABLE public.club_admins TO authenticated;

CREATE POLICY "Club administrators can read equipment orders"
ON public.equipment_orders FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()));

CREATE POLICY "Club administrators can update equipment orders"
ON public.equipment_orders FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()));

GRANT SELECT, UPDATE ON TABLE public.equipment_orders TO authenticated;

COMMENT ON TABLE public.club_admins IS 'Comptes autorisés à accéder à l’espace de gestion privé du club.';
