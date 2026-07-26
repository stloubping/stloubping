CREATE TABLE IF NOT EXISTS public.shop_preorders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  first_name TEXT NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80),
  last_name TEXT NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 80),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  product_name TEXT NOT NULL DEFAULT 'Maillot officiel du club',
  size TEXT NOT NULL,
  quantity SMALLINT NOT NULL CHECK (quantity BETWEEN 1 AND 10),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
  consent BOOLEAN NOT NULL CHECK (consent = TRUE),
  status TEXT NOT NULL DEFAULT 'received' CHECK (
    status IN ('received', 'confirmed', 'ready', 'delivered', 'cancelled')
  )
);

ALTER TABLE public.shop_preorders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public shop preorder submissions"
ON public.shop_preorders
FOR INSERT
TO anon, authenticated
WITH CHECK (consent = TRUE AND status = 'received');

GRANT INSERT ON TABLE public.shop_preorders TO anon, authenticated;

CREATE OR REPLACE VIEW public.shop_preorders_public
AS
SELECT
  id,
  created_at,
  first_name,
  left(last_name, 1) || '.' AS last_name_initial,
  product_name,
  size,
  quantity,
  status
FROM public.shop_preorders
WHERE status <> 'cancelled';

CREATE POLICY "Allow public reading of visible shop preorders"
ON public.shop_preorders
FOR SELECT
TO anon, authenticated
USING (status <> 'cancelled');

GRANT SELECT ON TABLE public.shop_preorders_public TO anon, authenticated;

COMMENT ON TABLE public.shop_preorders IS
  'Précommandes de la boutique, avec coordonnées privées réservées à la gestion du club.';

COMMENT ON VIEW public.shop_preorders_public IS
  'Liste publique des précommandes sans coordonnées ni nom de famille complet.';
