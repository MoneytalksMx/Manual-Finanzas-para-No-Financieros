-- Vocero único por equipo y registro de jugadores · La caja de la planta · 16 de noviembre de 2026
--
-- Qué hace:
-- 1. Agrega a caja_mesas las columnas vocero_id (el id del celular que es vocero del equipo) y
--    vocero_desde (desde cuándo). Si vocero_id está vacío, el equipo no tiene vocero.
-- 2. Crea caja_jugadores: un renglón por celular y partida, con el nombre que escribió la persona,
--    su equipo, su rol y la última vez que su celular se conectó. Así el facilitador ve quién está
--    en cada equipo y puede elegir al nuevo vocero por nombre.
-- 3. Da a caja_jugadores los mismos permisos abiertos que el resto de las tablas caja_*.
--
-- Se puede correr dos veces sin error: usa "if not exists" y borra las políticas antes de crearlas.

alter table public.caja_mesas add column if not exists vocero_id text;
alter table public.caja_mesas add column if not exists vocero_desde timestamptz;

create table if not exists public.caja_jugadores (
  partida     text        not null references public.caja_partidas(codigo) on delete cascade,
  dispositivo text        not null check (char_length(dispositivo) between 8 and 64),
  mesa        smallint    not null check (mesa between 1 and 5),
  nombre      text        not null check (char_length(nombre) between 1 and 40),
  rol         text        not null check (rol in ('Vocero', 'Moderador', 'Tesorero', 'Integrante')),
  visto_at    timestamptz not null default now(),
  primary key (partida, dispositivo)
);

alter table public.caja_jugadores enable row level security;

drop policy if exists caja_jugadores_select on public.caja_jugadores;
drop policy if exists caja_jugadores_insert on public.caja_jugadores;
drop policy if exists caja_jugadores_update on public.caja_jugadores;
drop policy if exists caja_jugadores_delete on public.caja_jugadores;
create policy caja_jugadores_select on public.caja_jugadores for select to anon using (true);
create policy caja_jugadores_insert on public.caja_jugadores for insert to anon with check (true);
create policy caja_jugadores_update on public.caja_jugadores for update to anon using (true) with check (true);
create policy caja_jugadores_delete on public.caja_jugadores for delete to anon using (true);
