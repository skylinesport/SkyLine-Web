-- Function to check and award badges to a user
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
  v_category_count INTEGER;
  v_sports_count INTEGER;
  v_creative_count INTEGER;
  v_volunteering_count INTEGER;
  v_certifications_count INTEGER;
  v_badge RECORD;
BEGIN
  -- Get user profile stats
  SELECT star_rating, total_achievements, verified_achievements
  INTO v_profile
  FROM public.profiles
  WHERE id = p_user_id;

  -- Count achievements by category
  SELECT COUNT(DISTINCT a.category_id)
  INTO v_category_count
  FROM public.achievements a
  WHERE a.user_id = p_user_id AND a.status = 'approved';

  -- Count sports achievements
  SELECT COUNT(*)
  INTO v_sports_count
  FROM public.achievements a
  JOIN public.categories c ON a.category_id = c.id
  WHERE a.user_id = p_user_id AND c.name = 'Sports' AND a.status = 'approved';

  -- Count creative achievements (Arts & Culture)
  SELECT COUNT(*)
  INTO v_creative_count
  FROM public.achievements a
  JOIN public.categories c ON a.category_id = c.id
  WHERE a.user_id = p_user_id AND c.name = 'Arts & Culture' AND a.status = 'approved';

  -- Count volunteering achievements
  SELECT COUNT(*)
  INTO v_volunteering_count
  FROM public.achievements a
  JOIN public.categories c ON a.category_id = c.id
  WHERE a.user_id = p_user_id AND c.name = 'Volunteering' AND a.status = 'approved';

  -- Count certifications
  SELECT COUNT(*)
  INTO v_certifications_count
  FROM public.achievements a
  JOIN public.categories c ON a.category_id = c.id
  WHERE a.user_id = p_user_id AND c.name = 'Certifications' AND a.status = 'approved';

  -- Check each badge and award if criteria met
  FOR v_badge IN SELECT * FROM public.badges LOOP
    -- Skip if already earned
    IF EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
      CONTINUE;
    END IF;

    -- Check badge requirements
    IF v_badge.requirement_type = 'star_rating' AND v_profile.star_rating >= v_badge.requirement_value THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (p_user_id, 'badge_earned', 'New Badge Earned!', 'Congratulations! You earned the "' || v_badge.name || '" badge.');
    ELSIF v_badge.requirement_type = 'total_achievements' AND v_profile.total_achievements >= v_badge.requirement_value THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (p_user_id, 'badge_earned', 'New Badge Earned!', 'Congratulations! You earned the "' || v_badge.name || '" badge.');
    ELSIF v_badge.requirement_type = 'category_count' AND v_category_count >= v_badge.requirement_value THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (p_user_id, 'badge_earned', 'New Badge Earned!', 'Congratulations! You earned the "' || v_badge.name || '" badge.');
    ELSIF v_badge.requirement_type = 'sports_achievements' AND v_sports_count >= v_badge.requirement_value THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (p_user_id, 'badge_earned', 'New Badge Earned!', 'Congratulations! You earned the "' || v_badge.name || '" badge.');
    ELSIF v_badge.requirement_type = 'creative_achievements' AND v_creative_count >= v_badge.requirement_value THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (p_user_id, 'badge_earned', 'New Badge Earned!', 'Congratulations! You earned the "' || v_badge.name || '" badge.');
    ELSIF v_badge.requirement_type = 'volunteering_achievements' AND v_volunteering_count >= v_badge.requirement_value THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (p_user_id, 'badge_earned', 'New Badge Earned!', 'Congratulations! You earned the "' || v_badge.name || '" badge.');
    ELSIF v_badge.requirement_type = 'certifications' AND v_certifications_count >= v_badge.requirement_value THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (p_user_id, 'badge_earned', 'New Badge Earned!', 'Congratulations! You earned the "' || v_badge.name || '" badge.');
    END IF;
  END LOOP;
END;
$$;

-- Trigger function to auto-award badges after profile stats update
CREATE OR REPLACE FUNCTION public.trigger_badge_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.check_and_award_badges(NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS check_badges_on_profile_update ON public.profiles;
CREATE TRIGGER check_badges_on_profile_update
  AFTER UPDATE OF star_rating, total_achievements, verified_achievements ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_badge_check();

-- Create trigger to notify on achievement verification
CREATE OR REPLACE FUNCTION public.notify_achievement_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (NEW.user_id, 'achievement_verified', 'Achievement Verified!', 'Your achievement "' || NEW.title || '" has been verified.');
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (NEW.user_id, 'achievement_rejected', 'Achievement Rejected', 'Your achievement "' || NEW.title || '" was not approved.');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_on_achievement_status ON public.achievements;
CREATE TRIGGER notify_on_achievement_status
  AFTER UPDATE OF status ON public.achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_achievement_status_change();

-- Create trigger for star milestones
CREATE OR REPLACE FUNCTION public.notify_star_milestone()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_stars INTEGER;
  new_stars INTEGER;
BEGIN
  old_stars := FLOOR(OLD.star_rating);
  new_stars := FLOOR(NEW.star_rating);
  
  IF new_stars > old_stars AND new_stars > 0 THEN
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (NEW.id, 'star_milestone', 'Star Milestone!', 'Congratulations! You reached ' || new_stars || ' star' || CASE WHEN new_stars > 1 THEN 's' ELSE '' END || '!');
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_on_star_milestone ON public.profiles;
CREATE TRIGGER notify_on_star_milestone
  AFTER UPDATE OF star_rating ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_star_milestone();