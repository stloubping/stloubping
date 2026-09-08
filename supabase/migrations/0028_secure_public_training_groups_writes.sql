-- Seuls les administrateurs peuvent alimenter la copie publique via le trigger.
DROP POLICY IF EXISTS "Club admins can sync public training groups" ON public.public_training_group_players;
CREATE POLICY "Club admins can sync public training groups"
  ON public.public_training_group_players FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));
