CREATE TABLE IF NOT EXISTS public.team_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, team_key)
);

ALTER TABLE public.team_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can read their own profile" ON public.team_memberships;

CREATE POLICY "Team members can read their own profile"
ON public.team_memberships FOR SELECT TO authenticated
USING (user_id = auth.uid());

GRANT SELECT ON TABLE public.team_memberships TO authenticated;

COMMENT ON TABLE public.team_memberships IS
  'Profils autorises a acceder aux espaces prives des equipes du club.';
