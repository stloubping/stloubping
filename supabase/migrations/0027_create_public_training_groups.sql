-- Copie publique limitée aux noms et aux groupes : aucun âge ni numéro de licence.
CREATE TABLE IF NOT EXISTS public.public_training_group_players (
  id uuid PRIMARY KEY REFERENCES public.training_group_players(id) ON DELETE CASCADE,
  group_key text NOT NULL CHECK (group_key IN (
    'debutant', 'intermediaire', 'perfectionnement', 'competition',
    'adultes_loisir', 'adultes_competition'
  )),
  first_name text NOT NULL,
  last_name text NOT NULL,
  season text NOT NULL
);

ALTER TABLE public.public_training_group_players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read training groups" ON public.public_training_group_players;
CREATE POLICY "Public can read training groups"
  ON public.public_training_group_players FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON public.public_training_group_players TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.public_training_group_players TO authenticated;

INSERT INTO public.public_training_group_players (id, group_key, first_name, last_name, season)
SELECT id, group_key, first_name, last_name, season
FROM public.training_group_players
ON CONFLICT (id) DO UPDATE SET
  group_key = EXCLUDED.group_key,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  season = EXCLUDED.season;

CREATE OR REPLACE FUNCTION public.sync_public_training_group_player()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  INSERT INTO public.public_training_group_players (id, group_key, first_name, last_name, season)
  VALUES (NEW.id, NEW.group_key, NEW.first_name, NEW.last_name, NEW.season)
  ON CONFLICT (id) DO UPDATE SET
    group_key = EXCLUDED.group_key,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    season = EXCLUDED.season;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS training_group_players_public_sync ON public.training_group_players;
CREATE TRIGGER training_group_players_public_sync
  AFTER INSERT OR UPDATE ON public.training_group_players
  FOR EACH ROW EXECUTE FUNCTION public.sync_public_training_group_player();
