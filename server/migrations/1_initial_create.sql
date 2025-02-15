create extension if not exists citext;
create extension if not exists pgcrypto;

create or replace function trigger_set_updated_at() returns trigger as $$
begin
  NEW.updated_at := current_timestamp;
  return NEW;
end;
$$ language plpgsql;

create table if not exists usr (
  id integer primary key generated by default as identity,
  username citext unique not null,
  password text not null check (password <> ''),
  created_at timestamptz not null default current_timestamp
);

insert into usr
  (username, password)
values
  ('test', crypt('test', gen_salt('bf', 8)))
;
