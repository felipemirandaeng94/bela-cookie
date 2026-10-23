-- Bela Cookie: tabela unica de documentos, com acesso so para o dono (usuario logado).
create table if not exists public.docs (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  col text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, col, id)
);

alter table public.docs enable row level security;

drop policy if exists "dono acessa os proprios dados" on public.docs;
create policy "dono acessa os proprios dados" on public.docs
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

revoke all on public.docs from anon;
grant select, insert, update, delete on public.docs to authenticated;
