-- Drop the overly permissive INSERT policy
-- Service role already bypasses RLS, so this policy is unnecessary
-- and creates a false sense of security. By removing it, we make it clear
-- that only service role (edge functions) can insert records.
DROP POLICY IF EXISTS "Service role can insert usage records" ON public.api_usage_tracking;

-- Add a comment to document the intended access pattern
COMMENT ON TABLE public.api_usage_tracking IS 'API usage tracking - INSERT only via service role in edge functions, SELECT restricted to own records via RLS';