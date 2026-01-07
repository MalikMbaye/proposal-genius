-- Create enum for proposal categories
CREATE TYPE public.library_industry AS ENUM (
  'technology',
  'finance',
  'healthcare',
  'education',
  'nonprofit',
  'retail',
  'media',
  'consulting',
  'real_estate',
  'other'
);

CREATE TYPE public.library_company_size AS ENUM (
  'startup',
  'small_business',
  'mid_market',
  'enterprise',
  'nonprofit',
  'government'
);

CREATE TYPE public.library_format AS ENUM (
  'written',
  'deck',
  'hybrid'
);

-- Library items (proposals)
CREATE TABLE public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  industry library_industry NOT NULL DEFAULT 'other',
  company_size library_company_size NOT NULL DEFAULT 'mid_market',
  format library_format NOT NULL DEFAULT 'written',
  deal_size_min INTEGER,
  deal_size_max INTEGER,
  deliverable_type TEXT, -- e.g., "Brand Strategy", "Web Development", "Consulting"
  pdf_path TEXT NOT NULL, -- path in storage bucket
  page_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published BOOLEAN DEFAULT false
);

-- Page-level annotations
CREATE TABLE public.library_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  library_item_id UUID NOT NULL REFERENCES public.library_items(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Course videos
CREATE TABLE public.library_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- embed URL (Vimeo, etc.)
  duration_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NDA acceptance tracking
CREATE TABLE public.library_nda_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_nda_acceptances ENABLE ROW LEVEL SECURITY;

-- Library items: Only published items visible to users with lifetime subscription
CREATE POLICY "Users with lifetime can view published items"
ON public.library_items
FOR SELECT
USING (
  is_published = true 
  AND EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_id = auth.uid() 
    AND subscription_type = 'lifetime'
    AND status = 'active'
  )
);

-- Annotations: Same access as library items
CREATE POLICY "Users with lifetime can view annotations"
ON public.library_annotations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.library_items li
    WHERE li.id = library_annotations.library_item_id
    AND li.is_published = true
  )
  AND EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_id = auth.uid() 
    AND subscription_type = 'lifetime'
    AND status = 'active'
  )
);

-- Videos: Same access pattern
CREATE POLICY "Users with lifetime can view videos"
ON public.library_videos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_id = auth.uid() 
    AND subscription_type = 'lifetime'
    AND status = 'active'
  )
);

-- NDA: Users can insert their own acceptance
CREATE POLICY "Users can accept NDA"
ON public.library_nda_acceptances
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- NDA: Users can view their own acceptance
CREATE POLICY "Users can view their NDA acceptance"
ON public.library_nda_acceptances
FOR SELECT
USING (auth.uid() = user_id);

-- Create storage bucket for library PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('library-pdfs', 'library-pdfs', false);

-- Storage policy: Only authenticated users with lifetime can view
CREATE POLICY "Lifetime users can view library PDFs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'library-pdfs'
  AND EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_id = auth.uid() 
    AND subscription_type = 'lifetime'
    AND status = 'active'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_library_items_updated_at
BEFORE UPDATE ON public.library_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();