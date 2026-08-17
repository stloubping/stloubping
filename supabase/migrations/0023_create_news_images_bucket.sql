INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  TRUE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public can view news images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'news-images');

CREATE POLICY "Club admins can upload news images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'news-images'
  AND EXISTS (SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid())
);

CREATE POLICY "Club admins can update news images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'news-images'
  AND EXISTS (SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid())
)
WITH CHECK (
  bucket_id = 'news-images'
  AND EXISTS (SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid())
);

CREATE POLICY "Club admins can delete news images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'news-images'
  AND EXISTS (SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid())
);
