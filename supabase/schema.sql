-- =============================================
-- Smart Bookmark App - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Create the bookmarks table
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- RLS Policies: Users can only access their own bookmarks
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
-- REPLICA IDENTITY FULL is required so DELETE events include the row's id
alter table public.bookmarks replica identity full;
alter publication supabase_realtime add table public.bookmarks;

-- Create an index for faster user-specific queries
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_bookmarks_created_at on public.bookmarks(created_at desc);
