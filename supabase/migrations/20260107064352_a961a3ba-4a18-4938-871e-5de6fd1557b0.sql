-- Remove email column from profiles table (emails should only be in auth.users)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Update the handle_new_user function to not insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;