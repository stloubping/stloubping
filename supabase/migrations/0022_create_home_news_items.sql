CREATE TABLE IF NOT EXISTS public.home_news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 180),
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '#',
  image_url TEXT NOT NULL DEFAULT '/images/hero/club-training.jpg',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.home_news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read home news"
ON public.home_news_items FOR SELECT TO anon, authenticated
USING (TRUE);

CREATE POLICY "Club admins can manage home news"
ON public.home_news_items FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()
));

GRANT SELECT ON public.home_news_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.home_news_items TO authenticated;

INSERT INTO public.home_news_items (id, title, published_at, location, description, link, image_url)
VALUES
  ('8d380069-6b86-43f1-8a64-7d6167900001', 'Précommandez votre maillot officiel St Loub Ping !', '2026-07-26', 'Boutique du Club', 'Les précommandes du maillot officiel St Loub Ping sont ouvertes ! Choisissez votre taille, indiquez la quantité souhaitée et envoyez directement votre demande depuis notre nouvelle page Boutique. Le maillot est disponible du 2 ans au 10XL au tarif de 35 €. Après votre précommande, le club vous contactera pour confirmer les modalités de règlement et de remise. Portez fièrement les couleurs du St Loub Ping à l’entraînement comme en compétition !', '/boutique#precommande', '/images/boutique/maillot-club-officiel.png'),
  ('8d380069-6b86-43f1-8a64-7d6167900002', 'Saison 2026-2027 : Ouverture des Inscriptions & Adhésions !', '2026-07-15', 'St Loub Ping - Saint-Loubès', 'La nouvelle saison 2026-2027 se prépare ! Retrouvez nos nouveaux tarifs, le planning complet des entraînements ainsi que tous les formulaires téléchargeables. Rejoignez-nous pour une nouvelle année de tennis de table dans la convivialité et la passion !', '/adhesions', '/images/adhesions/tarifs-2026-2027.jpg'),
  ('8d380069-6b86-43f1-8a64-7d6167900003', 'Convocation Assemblée Générale', '2026-08-29', 'Salle du club - Saint-Loubès', 'L’ensemble des adhérents, dirigeants et parents du club St Loub Ping est convoqué à l’Assemblée Générale Ordinaire du club qui se tiendra le samedi 29 août 2026. Retrouvez et téléchargez le document officiel de convocation ci-dessous.', '/documents/actualites/Convocation-AG-2026.pdf', '/images/actualites/convocation-ag-2026.png')
ON CONFLICT (id) DO NOTHING;
