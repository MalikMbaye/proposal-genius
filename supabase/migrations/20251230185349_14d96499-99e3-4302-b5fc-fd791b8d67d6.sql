-- Drop the existing INSERT policy that allows NULL user_id from clients
DROP POLICY IF EXISTS "Users can create usage records" ON public.proposal_usage;

-- Create a stricter INSERT policy - only authenticated users can insert their own records
-- Anonymous tracking will still work via edge function using service role key (bypasses RLS)
CREATE POLICY "Authenticated users can create their own usage records" 
ON public.proposal_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);