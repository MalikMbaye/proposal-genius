-- Fix security issues by adding restrictive RLS policies for missing operations

-- 1. contact_submissions: Add UPDATE and DELETE policies (block all - service role only)
CREATE POLICY "Block all updates on contact_submissions"
ON public.contact_submissions
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on contact_submissions"
ON public.contact_submissions
FOR DELETE
USING (false);

-- 2. user_subscriptions: Add INSERT, UPDATE, DELETE policies (block all - service role only)
CREATE POLICY "Block all inserts on user_subscriptions"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all updates on user_subscriptions"
ON public.user_subscriptions
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on user_subscriptions"
ON public.user_subscriptions
FOR DELETE
USING (false);

-- 3. api_usage_tracking: Add UPDATE and DELETE policies (block all - service role only)
CREATE POLICY "Block all updates on api_usage_tracking"
ON public.api_usage_tracking
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on api_usage_tracking"
ON public.api_usage_tracking
FOR DELETE
USING (false);

-- 4. proposal_usage: Add UPDATE and DELETE policies (block all - service role only)
CREATE POLICY "Block all updates on proposal_usage"
ON public.proposal_usage
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on proposal_usage"
ON public.proposal_usage
FOR DELETE
USING (false);

-- 5. deck_generation_jobs: Add DELETE policy (block all - service role only)
CREATE POLICY "Block all deletes on deck_generation_jobs"
ON public.deck_generation_jobs
FOR DELETE
USING (false);

-- 6. library_items: Add INSERT, UPDATE, DELETE policies (block all - service role only)
CREATE POLICY "Block all inserts on library_items"
ON public.library_items
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all updates on library_items"
ON public.library_items
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on library_items"
ON public.library_items
FOR DELETE
USING (false);

-- 7. library_annotations: Add INSERT, UPDATE, DELETE policies (block all - service role only)
CREATE POLICY "Block all inserts on library_annotations"
ON public.library_annotations
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all updates on library_annotations"
ON public.library_annotations
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on library_annotations"
ON public.library_annotations
FOR DELETE
USING (false);

-- 8. library_videos: Add INSERT, UPDATE, DELETE policies (block all - service role only)
CREATE POLICY "Block all inserts on library_videos"
ON public.library_videos
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all updates on library_videos"
ON public.library_videos
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on library_videos"
ON public.library_videos
FOR DELETE
USING (false);

-- 9. library_nda_acceptances: Add UPDATE and DELETE policies (block all to preserve legal records)
CREATE POLICY "Block all updates on library_nda_acceptances"
ON public.library_nda_acceptances
FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on library_nda_acceptances"
ON public.library_nda_acceptances
FOR DELETE
USING (false);

-- 10. dm_snapshots: Add UPDATE policy (block all to preserve snapshot integrity)
CREATE POLICY "Block all updates on dm_snapshots"
ON public.dm_snapshots
FOR UPDATE
USING (false);