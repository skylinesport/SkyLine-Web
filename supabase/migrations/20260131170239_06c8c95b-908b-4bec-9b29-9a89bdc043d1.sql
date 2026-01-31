-- Add is_restricted column to profiles for temporary account restrictions
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_restricted boolean NOT NULL DEFAULT false;

-- Add restriction_reason column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS restriction_reason text;

-- Add restricted_at timestamp
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS restricted_at timestamp with time zone;

-- Add restricted_by to track who restricted the account
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS restricted_by uuid;

-- Create a function to check if user is restricted
CREATE OR REPLACE FUNCTION public.is_user_restricted(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_restricted FROM public.profiles WHERE id = _user_id),
    false
  )
$$;

-- Allow admins to delete user profiles (cascade will handle related data)
-- Update RLS policy to allow admins to manage all profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile or admins can update any"
ON public.profiles
FOR UPDATE
USING ((auth.uid() = id) OR is_admin(auth.uid()));

-- Allow admins to delete achievements of any user
DROP POLICY IF EXISTS "Users can delete their own achievements" ON public.achievements;
CREATE POLICY "Users can delete their own achievements"
ON public.achievements
FOR DELETE
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));

-- Allow admins to update achievements of any user
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.achievements;
CREATE POLICY "Users can update their own achievements"
ON public.achievements
FOR UPDATE
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));