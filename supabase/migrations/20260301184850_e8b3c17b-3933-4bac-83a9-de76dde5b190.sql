
-- 1. user_settings table
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  offer_context text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Block deletes on user_settings"
  ON public.user_settings FOR DELETE
  USING (false);

-- 2. dm_threads table
CREATE TABLE public.dm_threads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Unknown',
  status text NOT NULL DEFAULT 'cold',
  qualification_score integer DEFAULT 0,
  heat_level text DEFAULT 'cold',
  last_activity timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.dm_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own threads"
  ON public.dm_threads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own threads"
  ON public.dm_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
  ON public.dm_threads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads"
  ON public.dm_threads FOR DELETE
  USING (auth.uid() = user_id);

-- 3. dm_messages table
CREATE TABLE public.dm_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id uuid NOT NULL REFERENCES public.dm_threads(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'analysis',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their threads"
  ON public.dm_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.dm_threads
    WHERE dm_threads.id = dm_messages.thread_id
    AND dm_threads.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages for their threads"
  ON public.dm_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.dm_threads
    WHERE dm_threads.id = dm_messages.thread_id
    AND dm_threads.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete messages for their threads"
  ON public.dm_messages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.dm_threads
    WHERE dm_threads.id = dm_messages.thread_id
    AND dm_threads.user_id = auth.uid()
  ));

CREATE POLICY "Block updates on dm_messages"
  ON public.dm_messages FOR UPDATE
  USING (false);

-- Add updated_at triggers
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dm_threads_updated_at
  BEFORE UPDATE ON public.dm_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
