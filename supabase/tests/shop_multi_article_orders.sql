-- Run inside a transaction after the migration; all synthetic orders roll back.
set local role anon;
insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website,items)
values ('Test','Multi','shop-multi-test@example.invalid','0000000000','ignored','ignored',1,true,'',
'[{"product_id":"maillot-officiel","size":"M","quantity":1,"unit_price_cents":1},{"product_id":"maillot-noir-loup-50","size":"S","quantity":1},{"product_id":"survetement-noir-rouge","size":"L","quantity":1}]');
reset role;
do $$
declare r public.shop_preorders%rowtype; total integer;
begin
  select * into strict r from public.shop_preorders where email='shop-multi-test@example.invalid';
  if r.quantity <> 3 or jsonb_array_length(r.items) <> 3 then raise exception 'Expected one slip with three items'; end if;
  select sum((value->>'quantity')::integer * (value->>'unit_price_cents')::integer) into total from jsonb_array_elements(r.items);
  if total <> 12500 then raise exception 'Expected server-validated total of 125 EUR'; end if;
  if r.product_name not like '%Survêtement noir et rouge%' or r.size not like '%L%' then raise exception 'Missing summary'; end if;
end $$;
set local role anon;
do $$
begin
  begin
    insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website,items)
    values ('Test','Invalid','shop-invalid-test@example.invalid','0000000000','x','x',1,true,'','[{"product_id":"maillot-officiel","size":"M","quantity":1},{"product_id":"bad-id","size":"M","quantity":1}]');
    raise exception 'Invalid article accepted';
  exception when check_violation then null; end;
  begin
    insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website,items)
    values ('Test','Invalid','shop-invalid-test@example.invalid','0000000000','x','x',1,true,'','[{"product_id":"maillot-officiel","size":"","quantity":1}]');
    raise exception 'Empty size accepted';
  exception when check_violation then null; end;
  begin
    insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website,items)
    values ('Test','Invalid','shop-invalid-test@example.invalid','0000000000','x','x',1,true,'','[{"product_id":"maillot-officiel","size":"M","quantity":11}]');
    raise exception 'Quantity above 10 accepted';
  exception when check_violation then null; end;
  begin
    insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website,items)
    values ('Test','Invalid','shop-invalid-test@example.invalid','0000000000','x','x',1,true,'','[{"product_id":"maillot-officiel","size":"M","quantity":1},{"product_id":"maillot-officiel","size":"M","quantity":1}]');
    raise exception 'Duplicate product accepted';
  exception when check_violation then null; end;
  begin
    insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website)
    values ('Test','Cooldown','shop-multi-test@example.invalid','0000000000','x','M',1,true,'');
    raise exception 'Cooldown missing';
  exception when raise_exception then
    if sqlerrm not like '%déjà été reçue%' then raise; end if;
  end;
end $$;
insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website,items)
values ('Test','Max','shop-max-test@example.invalid','0000000000','x','x',1,true,'',
'[{"product_id":"maillot-officiel","size":"M","quantity":10},{"product_id":"maillot-noir-loup-50","size":"S","quantity":10},{"product_id":"survetement-noir-rouge","size":"L","quantity":10}]');
insert into public.shop_preorders(first_name,last_name,email,phone,product_name,size,quantity,consent,website)
values ('Test','Legacy','shop-legacy-test@example.invalid','0000000000','Maillot Officiel du Club','M',1,true,'');
reset role;
update public.shop_preorders set items=jsonb_set(items,'{0,quantity}','2') where email='shop-multi-test@example.invalid';
do $$
begin
  if (select quantity from public.shop_preorders where email='shop-multi-test@example.invalid') <> 4 then raise exception 'Update must recalculate quantity'; end if;
  if (select quantity from public.shop_preorders where email='shop-max-test@example.invalid') <> 30 then raise exception 'Expected total quantity 30'; end if;
  if (select count(*) from public.shop_preorders where email='shop-invalid-test@example.invalid') <> 0 then raise exception 'Partial invalid order persisted'; end if;
  if has_table_privilege('anon','public.shop_preorders','select') then raise exception 'Raw contact data must not become public'; end if;
end $$;
select 'OK: one slip, three items, server prices, 30 pieces, atomic validation, cooldown, legacy orders and updates' as result;
