-- Desglose de misiones cumplidas por categoria, para el perfil por dimension.
-- Va como jsonb en la misma fila de progreso: son cinco claves y siempre se
-- leen juntas, asi que una tabla aparte solo agregaria un join.
alter table public.progress
  add column if not exists by_category jsonb not null default '{}'::jsonb;

-- El ranking suma el nivel del arbol; el desglose por categoria queda para el
-- perfil de cada uno y no se expone.
-- Se agrega una columna en el medio, y `create or replace` no puede reordenar
-- las columnas de una vista: hay que recrearla.
drop view if exists public.leaderboard;

create view public.leaderboard
with (security_invoker = off) as
  select
    p.display_name,
    p.emoji,
    g.level,
    g.days_at_top,
    g.streak,
    g.best_streak,
    g.total_completed,
    row_number() over (
      order by g.level desc, g.days_at_top desc, g.streak desc, g.best_streak desc
    ) as puesto
  from public.progress g
  join public.profiles p on p.id = g.user_id
  where p.in_ranking and p.display_name is not null;

revoke all on public.leaderboard from anon;
grant select on public.leaderboard to authenticated;
