ALTER TABLE public.home_news_items
ADD COLUMN IF NOT EXISTS display_order INTEGER;

WITH ranked_items AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY published_at DESC, created_at DESC)::INTEGER AS position
  FROM public.home_news_items
)
UPDATE public.home_news_items AS news
SET display_order = ranked_items.position
FROM ranked_items
WHERE news.id = ranked_items.id
  AND news.display_order IS NULL;

ALTER TABLE public.home_news_items
ALTER COLUMN display_order SET DEFAULT 9999,
ALTER COLUMN display_order SET NOT NULL;

CREATE OR REPLACE FUNCTION public.set_home_news_position(
  p_item_id UUID,
  p_position INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  current_position INTEGER;
  target_position INTEGER;
  item_count INTEGER;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.club_admins WHERE club_admins.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Acces refuse';
  END IF;

  SELECT display_order INTO current_position
  FROM public.home_news_items
  WHERE id = p_item_id
  FOR UPDATE;

  IF current_position IS NULL THEN
    RAISE EXCEPTION 'Actualite introuvable';
  END IF;

  SELECT COUNT(*)::INTEGER INTO item_count FROM public.home_news_items;
  target_position := GREATEST(1, LEAST(p_position, item_count));

  IF target_position < current_position THEN
    UPDATE public.home_news_items
    SET display_order = display_order + 1
    WHERE id <> p_item_id
      AND display_order >= target_position
      AND display_order < current_position;
  ELSIF target_position > current_position THEN
    UPDATE public.home_news_items
    SET display_order = display_order - 1
    WHERE id <> p_item_id
      AND display_order > current_position
      AND display_order <= target_position;
  END IF;

  UPDATE public.home_news_items
  SET display_order = target_position,
      updated_at = NOW()
  WHERE id = p_item_id;
END;
$$;

REVOKE ALL ON FUNCTION public.set_home_news_position(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_home_news_position(UUID, INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.compact_home_news_order_after_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  UPDATE public.home_news_items
  SET display_order = display_order - 1
  WHERE display_order > OLD.display_order;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS compact_home_news_order_after_delete ON public.home_news_items;
CREATE TRIGGER compact_home_news_order_after_delete
AFTER DELETE ON public.home_news_items
FOR EACH ROW EXECUTE FUNCTION public.compact_home_news_order_after_delete();
