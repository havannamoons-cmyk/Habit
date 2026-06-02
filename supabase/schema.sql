-- Tabla 1: hábitos.
-- Cada hábito pertenece a un usuario. user_id se autocompleta con el usuario logueado.
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now()
);

create index if not exists habits_user_id_idx on public.habits(user_id);

-- Tabla 2: check-ins.
-- Cada vez que el usuario marca un hábito como hecho un día, se crea un registro acá.
-- unique(habit_id, day): un solo check por hábito por día.
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, day)
);

create index if not exists check_ins_habit_day_idx on public.check_ins(habit_id, day);
create index if not exists check_ins_user_id_idx on public.check_ins(user_id);

-- Row Level Security: nadie puede leer ni escribir filas que no le pertenezcan.
-- Esto es CLAVE: la anon key es pública (la usa el navegador), así que sin RLS
-- cualquiera podría leer todas las filas. RLS hace que la DB misma filtre por usuario.
alter table public.habits enable row level security;
alter table public.check_ins enable row level security;

-- Políticas para habits: el dueño hace lo que quiera con sus filas.
create policy "users can read own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "users can insert own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "users can update own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "users can delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- Mismas políticas para check_ins.
create policy "users can read own check_ins"
  on public.check_ins for select
  using (auth.uid() = user_id);

create policy "users can insert own check_ins"
  on public.check_ins for insert
  with check (auth.uid() = user_id);

create policy "users can delete own check_ins"
  on public.check_ins for delete
  using (auth.uid() = user_id);
