-- Add ip_address column to contact_submissions for rate limiting
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS ip_address text;