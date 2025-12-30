-- Add business profile fields for one-time setup
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_context text,
ADD COLUMN IF NOT EXISTS background text,
ADD COLUMN IF NOT EXISTS proof_points text;