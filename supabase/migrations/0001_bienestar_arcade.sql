-- Bienestar Arcade: cuentas, progreso en la nube y ranking.
--
-- Aplicada en el proyecto `bienestar-arcade` (eogvnrloqwbhyxowhize).
--
-- IMPORTANTE: aplicar SOLO en un proyecto de Supabase dedicado a esta app.
-- No usar un proyecto que ya tenga otros datos: al habilitar el registro
-- abierto, cualquiera que se cree una cuenta pasa a ser un usuario
-- `authenticated` de ESE proyecto, y hereda todo lo que las policies de las
-- demas tablas le concedan al rol `authenticated`.

-- ---------------------------------------------------------------------------
-- PERFILES
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  emoji        text default '🌱',
  -- El ranking es opt-in: sin esto la persona juega pero no aparece listada.
  in_ranking   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint display_name_largo check (
    display_name is null or char_length(display_name) between 2 and 24
  )
);

-- ---------------------------------------------------------------------------
-- PROGRESO (el arbol)
-- ---------------------------------------------------------------------------
create table if not exists public.progress (
  user_id         uuid primary key references auth.users (id) on delete cascade,
  level           smallint not null default 0 check (level between 0 and 5),
  level_progress  smallint not null default 0 check (level_progress between 0 and 2),
  days_at_top     integer  not null default 0 check (days_at_top >= 0),
  streak          integer  not null default 0 check (streak >= 0),
  best_streak     integer  not null default 0 check (best_streak >= 0),
  points          integer  not null default 0 check (points >= 0),
  total_completed integer  not null default 0 check (total_completed >= 0),
  last_combo_day  date,
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- HISTORIAL: un renglon por dia jugado
-- ---------------------------------------------------------------------------
create table if not exists public.days (
  user_id  uuid not null references auth.users (id) on delete cascade,
  day      date not null,
  done     smallint not null default 0 check (done between 0 and 3),
  total    smallint not null default 3,
  wildcard boolean  not null default false,
  closed   boolean  not null default false,
  primary key (user_id, day)
);

create index if not exists days_user_day_idx on public.days (user_id, day desc);

-- ---------------------------------------------------------------------------
-- RLS: cada quien ve y toca lo suyo, nada mas
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.days     enable row level security;

drop policy if exists profiles_propio on public.profiles;
create policy profiles_propio on public.profiles
  for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists progress_propio on public.progress;
create policy progress_propio on public.progress
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists days_propio on public.days;
create policy days_propio on public.days
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- RANKING
--
-- Vista con security_invoker = off: corre con los permisos del dueno, asi que
-- puede leer todas las filas, pero expone unicamente las columnas de aca abajo.
-- El email y el user_id nunca salen. Solo entran quienes activaron `in_ranking`.
--
-- El linter de Supabase marca esto como `security_definer_view`. Es a proposito:
-- es la unica forma de mostrar un ranking sin abrir la tabla `progress` entera
-- a todos los usuarios. La alternativa —policies que dejen leer las filas de
-- quienes se anotaron— expone mas datos, no menos.
--
-- Se ordena por arbol y constancia, no por puntos: premia sostener, no inflar.
-- ---------------------------------------------------------------------------
create or replace view public.leaderboard
with (security_invoker = off) as
  select
    p.display_name,
    p.emoji,
    g.level,
    g.days_at_top,
    g.streak,
    g.best_streak,
    row_number() over (
      order by g.level desc, g.days_at_top desc, g.streak desc, g.best_streak desc
    ) as puesto
  from public.progress g
  join public.profiles p on p.id = g.user_id
  where p.in_ranking and p.display_name is not null;

revoke all on public.leaderboard from anon;
grant select on public.leaderboard to authenticated;

-- ---------------------------------------------------------------------------
-- Alta automatica: al registrarse, perfil y arbol en semilla
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  insert into public.progress (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- updated_at al dia
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists progress_touch on public.progress;
create trigger progress_touch before update on public.progress
  for each row execute function public.touch_updated_at();
