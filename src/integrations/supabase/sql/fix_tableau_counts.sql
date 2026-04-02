-- Supprime l'ancienne table qui ne se mettait pas à jour
DROP TABLE IF EXISTS public.tableau_counts;

-- Crée une VUE qui compte dynamiquement les inscriptions par tableau
CREATE OR REPLACE VIEW public.tableau_counts AS
WITH expanded_tableaux AS (
  -- On "déplie" les tableaux sélectionnés (qui sont dans un array) pour pouvoir les compter
  SELECT unnest(selected_tableaux) as tableau_id
  FROM public.tournament_registrations
)
SELECT 
  t.id as tableau_id,
  COUNT(e.tableau_id)::int as current_registrations
FROM (
  -- Liste de tous vos tableaux officiels
  VALUES ('t1'), ('t2'), ('t3'), ('t4'), ('t5'), ('t6'), ('d1')
) AS t(id)
LEFT JOIN expanded_tableaux e ON e.tableau_id = t.id
GROUP BY t.id;

-- On s'assure que la vue est accessible publiquement (lecture seule)
ALTER VIEW public.tableau_counts SET (security_invoker = on);