-- Create table for MilkZo conversation analytics
CREATE TABLE public.milkzo_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL,
  session_id TEXT NOT NULL,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant')),
  message_content TEXT NOT NULL,
  is_authenticated BOOLEAN NOT NULL DEFAULT false,
  client_ip_hash TEXT NULL,
  detected_intent TEXT NULL,
  conversion_action TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for analytics queries
CREATE INDEX idx_milkzo_conversations_session ON public.milkzo_conversations(session_id);
CREATE INDEX idx_milkzo_conversations_created_at ON public.milkzo_conversations(created_at);
CREATE INDEX idx_milkzo_conversations_intent ON public.milkzo_conversations(detected_intent);
CREATE INDEX idx_milkzo_conversations_conversion ON public.milkzo_conversations(conversion_action);

-- Enable RLS
ALTER TABLE public.milkzo_conversations ENABLE ROW LEVEL SECURITY;

-- Users can view their own conversations (authenticated only)
CREATE POLICY "Users can view their own MilkZo conversations"
ON public.milkzo_conversations
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Block direct inserts from clients (only edge function should insert)
CREATE POLICY "Block client inserts on milkzo_conversations"
ON public.milkzo_conversations
FOR INSERT
WITH CHECK (false);

-- Block updates
CREATE POLICY "Block all updates on milkzo_conversations"
ON public.milkzo_conversations
FOR UPDATE
USING (false);

-- Block deletes
CREATE POLICY "Block all deletes on milkzo_conversations"
ON public.milkzo_conversations
FOR DELETE
USING (false);

-- Create summary view for analytics (aggregate data only)
CREATE TABLE public.milkzo_analytics_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_conversations INTEGER NOT NULL DEFAULT 0,
  unique_sessions INTEGER NOT NULL DEFAULT 0,
  authenticated_sessions INTEGER NOT NULL DEFAULT 0,
  anonymous_sessions INTEGER NOT NULL DEFAULT 0,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  booking_intents INTEGER NOT NULL DEFAULT 0,
  pricing_questions INTEGER NOT NULL DEFAULT 0,
  feature_questions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable RLS on analytics (admin only - no client access)
ALTER TABLE public.milkzo_analytics_daily ENABLE ROW LEVEL SECURITY;

-- Block all client access to analytics table
CREATE POLICY "Block all access to milkzo_analytics_daily"
ON public.milkzo_analytics_daily
FOR ALL
USING (false);