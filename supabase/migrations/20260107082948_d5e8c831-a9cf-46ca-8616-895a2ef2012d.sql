-- Update contact_submissions INSERT policy to block client-side inserts
-- Only the edge function with service role should be able to insert
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Block client inserts on contact_submissions" ON public.contact_submissions
FOR INSERT WITH CHECK (false);