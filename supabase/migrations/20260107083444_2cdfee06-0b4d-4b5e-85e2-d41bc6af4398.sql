-- Drop all policies on contact_submissions table
DROP POLICY IF EXISTS "Block client inserts on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only service role can view submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block all updates on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block all deletes on contact_submissions" ON public.contact_submissions;

-- Drop the contact_submissions table
DROP TABLE IF EXISTS public.contact_submissions;