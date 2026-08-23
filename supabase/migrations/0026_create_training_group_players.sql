-- Gestion privée des groupes d'entraînement pour les responsables du club.
CREATE TABLE IF NOT EXISTS public.training_group_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key text NOT NULL CHECK (group_key IN (
    'debutant', 'intermediaire', 'perfectionnement', 'competition',
    'adultes_loisir', 'adultes_competition'
  )),
  first_name text NOT NULL CHECK (char_length(trim(first_name)) BETWEEN 1 AND 80),
  last_name text NOT NULL CHECK (char_length(trim(last_name)) BETWEEN 1 AND 80),
  age smallint CHECK (age IS NULL OR (age BETWEEN 3 AND 99)),
  source text NOT NULL DEFAULT 'new' CHECK (source IN ('existing', 'new')),
  licence text,
  season text NOT NULL DEFAULT '2026-2027',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS training_group_players_season_group_idx
  ON public.training_group_players (season, group_key);

ALTER TABLE public.training_group_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Club admins can manage training groups" ON public.training_group_players;
CREATE POLICY "Club admins can manage training groups"
  ON public.training_group_players
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));

REVOKE ALL ON TABLE public.training_group_players FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.training_group_players TO authenticated;

CREATE OR REPLACE FUNCTION public.set_training_group_players_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS training_group_players_updated_at ON public.training_group_players;
CREATE TRIGGER training_group_players_updated_at
  BEFORE UPDATE ON public.training_group_players
  FOR EACH ROW EXECUTE FUNCTION public.set_training_group_players_updated_at();
