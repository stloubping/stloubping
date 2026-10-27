-- One row is one order slip, with all selected textile lines saved atomically.
-- Existing single-product orders, public view and RLS policies remain unchanged.
alter table public.shop_preorders add column if not exists items jsonb;

create or replace function public.normalize_shop_order_items()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare
  item jsonb;
  normalized jsonb := '[]'::jsonb;
  seen text[] := array[]::text[];
  product_id text;
  product_name text;
  requested_size text;
  item_quantity integer;
  unit_price integer;
  names text[] := array[]::text[];
  item_sizes text[] := array[]::text[];
  total_quantity integer := 0;
begin
  if new.items is null then
    if tg_op = 'UPDATE' and old.items is not null then
      raise exception 'Le détail du bon multi-articles doit être conservé.' using errcode = '23514';
    end if;
    return new;
  end if;
  if jsonb_typeof(new.items) <> 'array' then
    raise exception 'Le panier doit être une liste.' using errcode = '23514';
  end if;
  if jsonb_array_length(new.items) not between 1 and 3 then
    raise exception 'Choisissez de un à trois articles.' using errcode = '23514';
  end if;
  for item in select value from jsonb_array_elements(new.items) loop
    product_id := item->>'product_id';
    case product_id
      when 'maillot-officiel' then product_name := 'Maillot Officiel du Club'; unit_price := 3500;
      when 'maillot-noir-loup-50' then product_name := 'Maillot noir · Loup 50'; unit_price := 1000;
      when 'survetement-noir-rouge' then product_name := 'Survêtement noir et rouge'; unit_price := 8000;
      else raise exception 'Article inconnu.' using errcode = '23514';
    end case;
    if product_id = any(seen) then
      raise exception 'Un article ne peut figurer qu’une fois sur le bon.' using errcode = '23514';
    end if;
    seen := array_append(seen, product_id);
    requested_size := btrim(coalesce(item->>'size', ''));
    if requested_size not in ('2 ans','4 ans','6 ans','8 ans','10 ans','12 ans','14 ans','XS','S','M','L','XL','2XL','3XL','4XL','5XL','6XL','7XL','8XL','9XL','10XL') then
      raise exception 'Choisissez une taille pour chaque article.' using errcode = '23514';
    end if;
    if coalesce(item->>'quantity', '') !~ '^([1-9]|10)$' then
      raise exception 'La quantité doit être comprise entre 1 et 10 par article.' using errcode = '23514';
    end if;
    item_quantity := (item->>'quantity')::integer;
    normalized := normalized || jsonb_build_array(jsonb_build_object(
      'product_id', product_id, 'product_name', product_name, 'size', requested_size,
      'quantity', item_quantity, 'unit_price_cents', unit_price));
    names := array_append(names, product_name || ' × ' || item_quantity);
    item_sizes := array_append(item_sizes, product_name || ' : ' || requested_size);
    total_quantity := total_quantity + item_quantity;
  end loop;
  new.items := normalized;
  new.product_name := array_to_string(names, ' · ');
  new.size := array_to_string(item_sizes, ' · ');
  new.quantity := total_quantity;
  return new;
end;
$$;

revoke all on function public.normalize_shop_order_items() from public, anon, authenticated;
drop trigger if exists normalize_shop_order_items on public.shop_preorders;
create trigger normalize_shop_order_items
before insert or update of items, product_name, size, quantity on public.shop_preorders
for each row execute function public.normalize_shop_order_items();

alter table public.shop_preorders drop constraint if exists shop_preorders_quantity_check;
alter table public.shop_preorders add constraint shop_preorders_quantity_check
  check (quantity between 1 and case when items is null then 10 else 30 end);
comment on column public.shop_preorders.items is
  'Lignes d’un même bon boutique ; nom, taille, quantité et prix TTC en centimes validés côté serveur. NULL pour les anciennes commandes.';
