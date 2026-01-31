-- Add profile customization columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS theme_color text DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS about text,
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS interests text[];

-- Create followers table
CREATE TABLE public.followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable RLS on followers
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Followers policies
CREATE POLICY "Anyone can view followers"
ON public.followers FOR SELECT
USING (true);

CREATE POLICY "Users can follow others"
ON public.followers FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON public.followers FOR DELETE
USING (auth.uid() = follower_id);

-- Create achievement likes table
CREATE TABLE public.achievement_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(achievement_id, user_id)
);

-- Enable RLS on achievement_likes
ALTER TABLE public.achievement_likes ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Anyone can view likes"
ON public.achievement_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like"
ON public.achievement_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
ON public.achievement_likes FOR DELETE
USING (auth.uid() = user_id);

-- Add pinned column to achievements
ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;

-- Update RLS for achievements to allow users to pin their own
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.achievements;
CREATE POLICY "Users can update their own achievements"
ON public.achievements FOR UPDATE
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));

-- Add follower/following counts to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS followers_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count integer DEFAULT 0;

-- Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    UPDATE public.profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger for follower counts
CREATE TRIGGER update_follower_counts_trigger
AFTER INSERT OR DELETE ON public.followers
FOR EACH ROW EXECUTE FUNCTION public.update_follower_counts();

-- Add likes count to achievements
ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;

-- Function to update likes count
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.achievements SET likes_count = likes_count + 1 WHERE id = NEW.achievement_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.achievements SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.achievement_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger for likes count
CREATE TRIGGER update_likes_count_trigger
AFTER INSERT OR DELETE ON public.achievement_likes
FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();