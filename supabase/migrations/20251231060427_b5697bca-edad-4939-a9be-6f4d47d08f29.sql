-- Create deck generation jobs table for persistent background processing
CREATE TABLE public.deck_generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
    manus_task_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deck_prompt TEXT,
    client_name TEXT,
    num_slides INTEGER DEFAULT 10,
    result_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.deck_generation_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own jobs"
ON public.deck_generation_jobs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs"
ON public.deck_generation_jobs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
ON public.deck_generation_jobs
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_deck_generation_jobs_updated_at
BEFORE UPDATE ON public.deck_generation_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for polling
ALTER PUBLICATION supabase_realtime ADD TABLE public.deck_generation_jobs;

-- Index for efficient polling
CREATE INDEX idx_deck_jobs_user_status ON public.deck_generation_jobs(user_id, status);
CREATE INDEX idx_deck_jobs_manus_task ON public.deck_generation_jobs(manus_task_id);