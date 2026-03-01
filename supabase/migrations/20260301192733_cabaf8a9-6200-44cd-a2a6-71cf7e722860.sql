-- Add heat_level column to leads table for Chrome extension compatibility
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS heat_level text DEFAULT 'cold';