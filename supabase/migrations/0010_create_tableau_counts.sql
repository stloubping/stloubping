-- Live counters used by the public tournament registration form.
-- Some Supabase projects already contain tableau_counts as a view.
-- The migration keeps that view intact and only creates the table/triggers when needed.

CREATE TABLE IF NOT EXISTS public.tableau_counts (
  tableau_id TEXT PRIMARY KEY,
  current_registrations INTEGER NOT NULL DEFAULT 0 CHECK (current_registrations >= 0)
);

DO $$
DECLARE
  relation_kind "char";
BEGIN
  SELECT c.relkind INTO relation_kind
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relname = 'tableau_counts';

  IF relation_kind = 'r' THEN
    EXECUTE 'ALTER TABLE public.tableau_counts ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Public may read tableau counts" ON public.tableau_counts';
    EXECUTE 'CREATE POLICY "Public may read tableau counts" ON public.tableau_counts FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'GRANT SELECT ON TABLE public.tableau_counts TO anon, authenticated';
  ELSIF relation_kind = 'v' THEN
    EXECUTE 'GRANT SELECT ON public.tableau_counts TO anon, authenticated';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_tableau_counts()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  relation_kind "char";
BEGIN
  SELECT c.relkind INTO relation_kind
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relname = 'tableau_counts';

  IF relation_kind <> 'r' THEN
    RETURN;
  END IF;

  DELETE FROM public.tableau_counts;
  INSERT INTO public.tableau_counts (tableau_id, current_registrations)
  SELECT selected.tableau_id, COUNT(*)::INTEGER
  FROM public.tournament_registrations AS registration
  CROSS JOIN LATERAL jsonb_array_elements_text(registration.selected_tableaux) AS selected(tableau_id)
  GROUP BY selected.tableau_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_tableau_counts_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.refresh_tableau_counts();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS refresh_tableau_counts_after_change ON public.tournament_registrations;
DO $$
DECLARE
  relation_kind "char";
BEGIN
  SELECT c.relkind INTO relation_kind
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relname = 'tableau_counts';

  IF relation_kind = 'r' THEN
    EXECUTE 'CREATE TRIGGER refresh_tableau_counts_after_change AFTER INSERT OR UPDATE OR DELETE ON public.tournament_registrations FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_tableau_counts_trigger()';
  END IF;
END;
$$;

SELECT public.refresh_tableau_counts();
