-- Create table for tracking proposal usage (IP-based for free tier, user-based for paid)
CREATE TABLE public.proposal_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX idx_proposal_usage_user_id ON public.proposal_usage(user_id);
CREATE INDEX idx_proposal_usage_ip_address ON public.proposal_usage(ip_address);
CREATE INDEX idx_proposal_usage_created_at ON public.proposal_usage(created_at);

-- Enable RLS
ALTER TABLE public.proposal_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view their own usage"
ON public.proposal_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Insert policy - allow authenticated users or service role
CREATE POLICY "Users can create usage records"
ON public.proposal_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create table for subscription/purchase tracking
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_type TEXT NOT NULL, -- 'pro_monthly', 'lifetime', 'pro_library', 'extra_proposals'
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due'
  current_period_end TIMESTAMP WITH TIME ZONE,
  extra_proposals_purchased INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON public.user_subscriptions(stripe_customer_id);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();