-- Add explicit authentication requirements to SELECT policies by recreating them
-- This makes it explicitly clear that anonymous users cannot access data

-- First, drop existing SELECT policies that the scanner is flagging

-- Profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Proposals table
DROP POLICY IF EXISTS "Users can view their own proposals" ON public.proposals;
CREATE POLICY "Users can view their own proposals" ON public.proposals
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Leads table
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
CREATE POLICY "Users can view their own leads" ON public.leads
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- User subscriptions table
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Deck generation jobs table
DROP POLICY IF EXISTS "Users can view their own jobs" ON public.deck_generation_jobs;
CREATE POLICY "Users can view their own jobs" ON public.deck_generation_jobs
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Proposal drafts table
DROP POLICY IF EXISTS "Users can view their own drafts" ON public.proposal_drafts;
CREATE POLICY "Users can view their own drafts" ON public.proposal_drafts
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- DM Snapshots table - add explicit auth check
DROP POLICY IF EXISTS "Users can view snapshots for their leads" ON public.dm_snapshots;
CREATE POLICY "Users can view snapshots for their leads" ON public.dm_snapshots
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = dm_snapshots.lead_id AND leads.user_id = auth.uid()
  )
);

-- API Usage Tracking - add INSERT policy that requires authentication
DROP POLICY IF EXISTS "Block all inserts on api_usage_tracking" ON public.api_usage_tracking;
CREATE POLICY "Authenticated users can insert their own usage" ON public.api_usage_tracking
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Library items - add explicit auth check  
DROP POLICY IF EXISTS "Users with lifetime can view published items" ON public.library_items;
CREATE POLICY "Users with lifetime can view published items" ON public.library_items
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  is_published = true AND
  EXISTS (
    SELECT 1 FROM user_subscriptions
    WHERE user_subscriptions.user_id = auth.uid()
    AND user_subscriptions.subscription_type = 'lifetime'
    AND user_subscriptions.status = 'active'
  )
);

-- Library annotations - add explicit auth check
DROP POLICY IF EXISTS "Users with lifetime can view annotations" ON public.library_annotations;
CREATE POLICY "Users with lifetime can view annotations" ON public.library_annotations
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM library_items li
    WHERE li.id = library_annotations.library_item_id AND li.is_published = true
  ) AND
  EXISTS (
    SELECT 1 FROM user_subscriptions
    WHERE user_subscriptions.user_id = auth.uid()
    AND user_subscriptions.subscription_type = 'lifetime'
    AND user_subscriptions.status = 'active'
  )
);

-- Library videos - add explicit auth check
DROP POLICY IF EXISTS "Users with lifetime can view videos" ON public.library_videos;
CREATE POLICY "Users with lifetime can view videos" ON public.library_videos
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM user_subscriptions
    WHERE user_subscriptions.user_id = auth.uid()
    AND user_subscriptions.subscription_type = 'lifetime'
    AND user_subscriptions.status = 'active'
  )
);

-- Proposal usage - update INSERT policy to allow both authenticated users and service role
DROP POLICY IF EXISTS "Authenticated users can create their own usage records" ON public.proposal_usage;
CREATE POLICY "Authenticated users can create their own usage records" ON public.proposal_usage
FOR INSERT WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (user_id IS NULL)  -- Allow anonymous usage tracking with null user_id
);

-- API usage - also add SELECT with explicit auth check
DROP POLICY IF EXISTS "Users can view their own usage" ON public.api_usage_tracking;
CREATE POLICY "Users can view their own usage" ON public.api_usage_tracking
FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);