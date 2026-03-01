-- Fix dm_usage RLS policies: change from RESTRICTIVE to PERMISSIVE

-- Drop all existing restrictive policies
DROP POLICY IF EXISTS "Block all deletes on dm_usage" ON public.dm_usage;
DROP POLICY IF EXISTS "Users can insert their own DM usage" ON public.dm_usage;
DROP POLICY IF EXISTS "Users can update their own DM usage" ON public.dm_usage;
DROP POLICY IF EXISTS "Users can view their own DM usage" ON public.dm_usage;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Users can view their own DM usage"
  ON public.dm_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DM usage"
  ON public.dm_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DM usage"
  ON public.dm_usage FOR UPDATE
  USING (auth.uid() = user_id);