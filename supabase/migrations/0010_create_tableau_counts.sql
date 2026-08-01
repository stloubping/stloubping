-- Live counters used by the public tournament registration form.
CREATE TABLE IF NOT EXISTS public.tableau_counts (
  tableau_id TEXT PRIMARY KEY,
  current_registrations INTEGER NOT NULL DEFAULT 0 CHECK (current_registrations >= 0)
);

ALTER TABLE public.tableau_counts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public may read tableau counts" ON public.tableau_counts;
CREATE POLICY "Public may read tableau counts" ON public.tableau_counts
  FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON TABLE public.tableau_counts TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.refresh_tableau_counts()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.tableau_counts;
  INSERT INTO public.tableau_counts (tableau_id, current_registrations)
  SELECT tableau_id, COUNT(*)::INTEGER
  FROM public.tournament_registrations AS registration
  CROSS JOIN LATERAL jsonb_array_elements_text(registration.selected_tableaux) AS selected(tableau_id)
  GROUP BY tableau_id;
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
CREATE TRIGGER refresh_tableau_counts_after_change
AFTER INSERT OR UPDATE OR DELETE ON public.tournament_registrations
FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_tableau_counts_trigger();

SELECT public.refresh_tableau_counts();
