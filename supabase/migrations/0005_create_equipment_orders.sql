CREATE TABLE IF NOT EXISTS public.equipment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  first_name TEXT NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80),
  last_name TEXT NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 80),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  items JSONB NOT NULL CHECK (
    jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) BETWEEN 1 AND 20
  ),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 1000),
  consent BOOLEAN NOT NULL CHECK (consent = TRUE),
  status TEXT NOT NULL DEFAULT 'received' CHECK (
    status IN ('received', 'confirmed', 'ordered', 'available', 'delivered', 'cancelled')
  )
);

ALTER TABLE public.equipment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public equipment order submissions"
ON public.equipment_orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  consent = TRUE
  AND status = 'received'
  AND jsonb_array_length(items) BETWEEN 1 AND 20
);

GRANT INSERT ON TABLE public.equipment_orders TO anon, authenticated;

CREATE OR REPLACE VIEW public.equipment_orders_public AS
SELECT
  id,
  created_at,
  first_name,
  left(last_name, 1) || '.' AS last_name_initial,
  jsonb_array_length(items) AS item_count,
  status
FROM public.equipment_orders
WHERE status <> 'cancelled';

GRANT SELECT ON TABLE public.equipment_orders_public TO anon, authenticated;

COMMENT ON TABLE public.equipment_orders IS
  'Commandes de matériel Wack Sport transmises par les joueurs au club.';

COMMENT ON VIEW public.equipment_orders_public IS
  'Liste publique anonymisée des commandes de matériel reçues.';
