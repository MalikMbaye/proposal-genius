-- Create library_modules table
CREATE TABLE public.library_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  icon TEXT NOT NULL DEFAULT 'FileText',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.library_modules ENABLE ROW LEVEL SECURITY;

-- Users with lifetime can view modules
CREATE POLICY "Users with lifetime can view modules" 
ON public.library_modules 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM user_subscriptions 
    WHERE user_subscriptions.user_id = auth.uid() 
    AND user_subscriptions.subscription_type = 'lifetime' 
    AND user_subscriptions.status = 'active'
  )
);

-- Block all modifications
CREATE POLICY "Block all inserts on library_modules" ON public.library_modules FOR INSERT WITH CHECK (false);
CREATE POLICY "Block all updates on library_modules" ON public.library_modules FOR UPDATE USING (false);
CREATE POLICY "Block all deletes on library_modules" ON public.library_modules FOR DELETE USING (false);

-- Add module_id and sort_order to library_items
ALTER TABLE public.library_items 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES public.library_modules(id),
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS outcome TEXT DEFAULT 'closed_won';

-- Seed the 6 modules
INSERT INTO public.library_modules (title, subtitle, icon, sort_order) VALUES
('App Development & Product Builds', 'Full-stack proposals for mobile apps, web apps, and digital products', 'Smartphone', 1),
('Growth Marketing & Customer Acquisition', 'Proposals for scaling revenue, content systems, and paid media', 'TrendingUp', 2),
('B2B SaaS & Enterprise', 'Complex proposals for software companies and enterprise clients', 'Building2', 3),
('Brand Development & Launch Strategy', 'Branding, positioning, pre-launch, and market validation', 'Palette', 4),
('Fractional & Retainer Partnerships', 'Ongoing advisory, profit share, and operating partner structures', 'Handshake', 5),
('Pitch Decks & Fundraising Support', 'Investor materials that helped raise $50M+', 'Presentation', 6);