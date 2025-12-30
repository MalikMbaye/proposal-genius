-- Add deck_url column to store generated slide deck PDF URLs
ALTER TABLE public.proposals 
ADD COLUMN deck_url TEXT;