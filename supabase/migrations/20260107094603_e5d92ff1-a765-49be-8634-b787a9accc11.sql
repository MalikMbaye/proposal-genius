-- Create storage bucket for user uploaded proposals
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-proposals', 'user-proposals', false);

-- Storage policies for user proposals
CREATE POLICY "Users can upload their own proposals"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-proposals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own proposals"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-proposals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own proposals"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-proposals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Table to track uploaded proposals with metadata
CREATE TABLE public.uploaded_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  redacted_storage_path TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'processing',
  redaction_summary JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uploaded_proposals ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own uploaded proposals"
ON public.uploaded_proposals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploaded proposals"
ON public.uploaded_proposals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploaded proposals"
ON public.uploaded_proposals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploaded proposals"
ON public.uploaded_proposals FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_uploaded_proposals_updated_at
BEFORE UPDATE ON public.uploaded_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();