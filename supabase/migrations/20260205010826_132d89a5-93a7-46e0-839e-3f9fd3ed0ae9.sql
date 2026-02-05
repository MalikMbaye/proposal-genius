-- Remove the public SELECT policy from launch_promo_config
DROP POLICY IF EXISTS "Launch promo config is publicly readable" ON public.launch_promo_config;

-- Create a restrictive policy that denies all client access
-- The edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS
CREATE POLICY "No direct client access to launch_promo_config"
ON public.launch_promo_config
FOR SELECT
USING (false);