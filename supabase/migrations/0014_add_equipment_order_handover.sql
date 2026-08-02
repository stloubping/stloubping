ALTER TABLE public.equipment_orders
  ADD COLUMN IF NOT EXISTS paid_at DATE,
  ADD COLUMN IF NOT EXISTS handed_over_at DATE,
  ADD COLUMN IF NOT EXISTS handed_over_by TEXT;

ALTER TABLE public.equipment_orders
  DROP CONSTRAINT IF EXISTS equipment_orders_handed_over_by_length;

ALTER TABLE public.equipment_orders
  ADD CONSTRAINT equipment_orders_handed_over_by_length
  CHECK (handed_over_by IS NULL OR char_length(handed_over_by) <= 120);

COMMENT ON COLUMN public.equipment_orders.paid_at IS 'Date de paiement de la commande par le joueur.';
COMMENT ON COLUMN public.equipment_orders.handed_over_at IS 'Date de remise de la commande au joueur.';
COMMENT ON COLUMN public.equipment_orders.handed_over_by IS 'Nom de la personne du club ayant remis la commande.';
