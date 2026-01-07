-- Create dm_usage table to track DM analyses and leads
CREATE TABLE public.dm_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  analyses_used INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT date_trunc('month', now()),
  period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (date_trunc('month', now()) + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX idx_dm_usage_user_period ON public.dm_usage(user_id, period_start);

-- Enable RLS
ALTER TABLE public.dm_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own DM usage"
ON public.dm_usage FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own DM usage"
ON public.dm_usage FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DM usage"
ON public.dm_usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Block all deletes on dm_usage"
ON public.dm_usage FOR DELETE
USING (false);

-- Add trigger for updated_at
CREATE TRIGGER update_dm_usage_updated_at
BEFORE UPDATE ON public.dm_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add dm_subscription_tier and dm_subscription columns to user_subscriptions
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS dm_subscription_tier TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dm_subscription_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dm_period_end TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pitchgenius_customer BOOLEAN DEFAULT false;