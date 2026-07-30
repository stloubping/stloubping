CREATE TABLE IF NOT EXISTS public.wacksport_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  order_number TEXT NOT NULL UNIQUE CHECK (char_length(order_number) BETWEEN 1 AND 80),
  ordered_at DATE NOT NULL,
  received_at DATE,
  paid_at DATE,
  players_due_at DATE
);

ALTER TABLE public.wacksport_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Club admins can view Wack Sport orders"
ON public.wacksport_orders FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));

CREATE POLICY "Club admins can create Wack Sport orders"
ON public.wacksport_orders FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));

CREATE POLICY "Club admins can update Wack Sport orders"
ON public.wacksport_orders FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));

CREATE POLICY "Club admins can delete Wack Sport orders"
ON public.wacksport_orders FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.club_admins WHERE user_id = auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.wacksport_orders TO authenticated;
