-- Create api_usage_tracking table for tracking Claude API token usage
CREATE TABLE public.api_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  function_name TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying by user and date
CREATE INDEX idx_api_usage_user_date ON public.api_usage_tracking (user_id, created_at);

-- Enable RLS
ALTER TABLE public.api_usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own usage"
ON public.api_usage_tracking
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert (from edge functions)
CREATE POLICY "Service role can insert usage records"
ON public.api_usage_tracking
FOR INSERT
WITH CHECK (true);

-- Create proposal_drafts table for autosave
CREATE TABLE public.proposal_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_name TEXT,
  client_context TEXT,
  background TEXT,
  business_type TEXT,
  custom_business_type TEXT,
  pricing_tiers JSONB,
  selected_case_studies TEXT[],
  proposal_length TEXT,
  last_saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.proposal_drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies for drafts
CREATE POLICY "Users can view their own drafts"
ON public.proposal_drafts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
ON public.proposal_drafts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
ON public.proposal_drafts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
ON public.proposal_drafts
FOR DELETE
USING (auth.uid() = user_id);

-- Add concurrent_jobs column to track active deck generation jobs for rate limiting
ALTER TABLE public.deck_generation_jobs ADD COLUMN IF NOT EXISTS queue_position INTEGER;

-- Create function to get queue position
CREATE OR REPLACE FUNCTION public.get_deck_queue_position(job_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM deck_generation_jobs
  WHERE status IN ('pending', 'running')
    AND created_at < (SELECT created_at FROM deck_generation_jobs WHERE id = job_id)
$$;