ALTER TABLE public.equipment_orders
  ADD COLUMN IF NOT EXISTS status_before_completed TEXT;

ALTER TABLE public.equipment_orders
  DROP CONSTRAINT IF EXISTS equipment_orders_status_check;

ALTER TABLE public.equipment_orders
  ADD CONSTRAINT equipment_orders_status_check
  CHECK (status IN ('received', 'confirmed', 'ordered', 'available', 'delivered', 'completed', 'cancelled'));

ALTER TABLE public.equipment_orders
  DROP CONSTRAINT IF EXISTS equipment_orders_status_before_completed_check;

ALTER TABLE public.equipment_orders
  ADD CONSTRAINT equipment_orders_status_before_completed_check
  CHECK (
    status_before_completed IS NULL
    OR status_before_completed IN ('received', 'confirmed', 'ordered', 'available', 'delivered')
  );

COMMENT ON COLUMN public.equipment_orders.status_before_completed
  IS 'Statut à restaurer lorsque la clôture d’une commande est annulée.';
