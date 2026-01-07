-- Create user_proposal_views table to track viewed proposals
CREATE TABLE public.user_proposal_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  library_item_id UUID NOT NULL REFERENCES public.library_items(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 1,
  last_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, library_item_id)
);

-- Enable RLS
ALTER TABLE public.user_proposal_views ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view their own progress" 
ON public.user_proposal_views 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own views
CREATE POLICY "Users can insert their own views" 
ON public.user_proposal_views 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own views
CREATE POLICY "Users can update their own views" 
ON public.user_proposal_views 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Block deletes
CREATE POLICY "Block all deletes on user_proposal_views" 
ON public.user_proposal_views 
FOR DELETE 
USING (false);

-- Create index for faster lookups
CREATE INDEX idx_user_proposal_views_user_id ON public.user_proposal_views(user_id);
CREATE INDEX idx_user_proposal_views_library_item_id ON public.user_proposal_views(library_item_id);