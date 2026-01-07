-- Create launch promo tracking table
CREATE TABLE public.launch_promo_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code TEXT NOT NULL UNIQUE DEFAULT 'LAUNCH_50',
  total_spots INTEGER NOT NULL DEFAULT 10,
  spots_claimed INTEGER NOT NULL DEFAULT 0,
  discount_percent INTEGER NOT NULL DEFAULT 50,
  promo_price_cents INTEGER NOT NULL DEFAULT 9700,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track which users claimed the promo
CREATE TABLE public.launch_promo_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  promo_id UUID NOT NULL REFERENCES public.launch_promo_config(id),
  stripe_payment_id TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, promo_id)
);

-- Enable RLS
ALTER TABLE public.launch_promo_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_promo_claims ENABLE ROW LEVEL SECURITY;

-- Promo config is readable by everyone (public pricing info)
CREATE POLICY "Launch promo config is publicly readable" 
ON public.launch_promo_config 
FOR SELECT 
USING (true);

-- Users can see their own claims
CREATE POLICY "Users can view their own promo claims" 
ON public.launch_promo_claims 
FOR SELECT 
USING (auth.uid() = user_id);

-- Insert the initial launch promo
INSERT INTO public.launch_promo_config (promo_code, total_spots, spots_claimed, discount_percent, promo_price_cents, is_active)
VALUES ('LAUNCH_50', 10, 0, 50, 9700, true);

-- Create trigger for updated_at
CREATE TRIGGER update_launch_promo_config_updated_at
BEFORE UPDATE ON public.launch_promo_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();