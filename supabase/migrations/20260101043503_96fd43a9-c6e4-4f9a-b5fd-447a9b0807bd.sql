-- Create leads table for tracking DM conversations
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Basic info (auto-extracted from first screenshot)
  name TEXT NOT NULL,
  platform TEXT DEFAULT 'instagram',
  
  -- Status (auto-updated by AI analysis)
  status TEXT DEFAULT 'cold' CHECK (status IN ('cold', 'warm', 'hot', 'qualified', 'proposal_sent', 'closed', 'lost')),
  qualification_score INTEGER CHECK (qualification_score >= 1 AND qualification_score <= 10),
  current_stage TEXT DEFAULT 'Opening' CHECK (current_stage IN ('Opening', 'Qualifying', 'Building Urgency', 'Pitching', 'Booking')),
  
  -- Accumulated context from conversations
  goals TEXT,
  pain_points TEXT[],
  budget_range TEXT,
  timeline TEXT,
  
  -- Links to other features
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  
  -- Timestamps
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dm_snapshots table for storing screenshot analyses
CREATE TABLE public.dm_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  
  -- Analysis result from AI (JSON structure for response options, context, etc.)
  analysis JSONB NOT NULL,
  
  -- Optional: track which response user actually sent
  response_used TEXT CHECK (response_used IN ('A', 'B', 'C')),
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads table
CREATE POLICY "Users can view their own leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
  ON public.leads FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for dm_snapshots (through leads relationship)
CREATE POLICY "Users can view snapshots for their leads"
  ON public.dm_snapshots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.leads WHERE leads.id = dm_snapshots.lead_id AND leads.user_id = auth.uid()
  ));

CREATE POLICY "Users can create snapshots for their leads"
  ON public.dm_snapshots FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.leads WHERE leads.id = dm_snapshots.lead_id AND leads.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete snapshots for their leads"
  ON public.dm_snapshots FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.leads WHERE leads.id = dm_snapshots.lead_id AND leads.user_id = auth.uid()
  ));

-- Indexes for performance
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_last_activity ON public.leads(last_activity DESC);
CREATE INDEX idx_dm_snapshots_lead_id ON public.dm_snapshots(lead_id);
CREATE INDEX idx_dm_snapshots_created ON public.dm_snapshots(created_at DESC);

-- Add trigger for updated_at on leads
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();