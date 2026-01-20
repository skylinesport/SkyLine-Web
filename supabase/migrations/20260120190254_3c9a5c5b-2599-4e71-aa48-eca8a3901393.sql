-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create achievement_status enum
CREATE TYPE public.achievement_status AS ENUM ('pending', 'approved', 'rejected');

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, icon, color) VALUES
  ('Sports', 'trophy', '#FF6B6B'),
  ('Dance', 'music', '#4ECDC4'),
  ('Singing', 'mic', '#45B7D1'),
  ('Art', 'palette', '#96CEB4'),
  ('Volunteering', 'heart', '#FFEAA7'),
  ('Competitions', 'award', '#DDA0DD'),
  ('Certifications', 'badge-check', '#98D8C8'),
  ('Other', 'star', '#F7DC6F');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  user_code TEXT NOT NULL UNIQUE DEFAULT LPAD(floor(random() * 10000000)::text, 7, '0'),
  bio TEXT,
  star_rating NUMERIC(3,1) NOT NULL DEFAULT 0 CHECK (star_rating >= 0 AND star_rating <= 7),
  total_achievements INTEGER NOT NULL DEFAULT 0,
  verified_achievements INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT,
  achievement_date DATE,
  proof_url TEXT,
  status achievement_status NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  weight NUMERIC(3,1) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, color, requirement_type, requirement_value) VALUES
  ('Rising Star', 'Earned your first star rating', 'star', '#FFD700', 'star_rating', 1),
  ('Achiever', 'Added 5 achievements', 'target', '#4ECDC4', 'total_achievements', 5),
  ('Multi-Talent', 'Achievements in 3+ categories', 'layers', '#9B59B6', 'category_count', 3),
  ('Sports Champion', '5+ verified sports achievements', 'trophy', '#E74C3C', 'sports_verified', 5),
  ('Creative Master', '5+ verified art/singing/dance achievements', 'palette', '#3498DB', 'creative_verified', 5),
  ('Community Hero', '3+ volunteering achievements', 'heart', '#E91E63', 'volunteering_count', 3),
  ('Certified Pro', '3+ certifications verified', 'badge-check', '#00BCD4', 'certifications_verified', 3),
  ('Legend', 'Achieved maximum 7-star rating', 'crown', '#FFD700', 'star_rating', 7);

-- Create user_badges junction table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- Create helper function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Achievements policies
CREATE POLICY "Anyone can view approved achievements"
  ON public.achievements FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can delete their own achievements"
  ON public.achievements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Badges policies (public read)
CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage badges"
  ON public.badges FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- User badges policies
CREATE POLICY "User badges are viewable by everyone"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "System can insert user badges"
  ON public.user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to calculate star rating based on achievements
CREATE OR REPLACE FUNCTION public.calculate_star_rating(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_weight NUMERIC;
  v_star_rating NUMERIC;
BEGIN
  -- Calculate total weight from verified achievements
  SELECT COALESCE(SUM(
    CASE 
      WHEN status = 'approved' THEN weight * 1.5  -- Verified achievements worth 1.5x
      ELSE weight 
    END
  ), 0)
  INTO v_total_weight
  FROM public.achievements
  WHERE user_id = p_user_id;
  
  -- Calculate star rating (max 7 stars)
  -- Each star requires progressively more points
  v_star_rating := LEAST(7, SQRT(v_total_weight / 2));
  
  RETURN ROUND(v_star_rating, 1);
END;
$$;

-- Function to update profile stats
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profile statistics
  UPDATE public.profiles
  SET 
    total_achievements = (
      SELECT COUNT(*) FROM public.achievements WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    verified_achievements = (
      SELECT COUNT(*) FROM public.achievements 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND status = 'approved'
    ),
    star_rating = public.calculate_star_rating(COALESCE(NEW.user_id, OLD.user_id)),
    updated_at = now()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update profile stats when achievements change
CREATE TRIGGER on_achievement_change
  AFTER INSERT OR UPDATE OR DELETE ON public.achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_stats();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;