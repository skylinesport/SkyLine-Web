import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Award, Share2, Copy, Check, Users, UserPlus, Sparkles, BookOpen, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { AchievementCard } from '@/components/AchievementCard';
import { Badge } from '@/components/Badge';
import { IdentityCard } from '@/components/IdentityCard';
import { FollowButton } from '@/components/FollowButton';
import { ProfileSettings } from '@/components/ProfileSettings';
import { UserSearch } from '@/components/UserSearch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

export default function Profile() {
  const { userCode } = useParams<{ userCode: string }>();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['public-profile', userCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_code', userCode)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userCode,
  });

  const { data: achievements } = useQuery({
    queryKey: ['public-achievements', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*, categories(name, color)')
        .eq('user_id', profile?.id)
        .eq('status', 'approved')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const { data: userBadges } = useQuery({
    queryKey: ['public-user-badges', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', profile?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const { data: followers } = useQuery({
    queryKey: ['followers', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', profile?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const { data: following } = useQuery({
    queryKey: ['following', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', profile?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Profile link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isOwnProfile = user?.id === profile?.id;
  const themeColor = profile?.theme_color || '#8B5CF6';

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Trophy className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-muted-foreground">This user doesn't exist or the link is incorrect.</p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="SkyLine" className="h-6 md:h-8 w-auto dark:invert" />
          </Link>
          
          <div className="flex items-center gap-1 md:gap-2">
            <UserSearch />
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="text-xs md:text-sm px-2 md:px-3">
              {copied ? <Check className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> : <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Profile Header with Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 md:p-8 text-center mb-6 md:mb-8 relative overflow-hidden"
        >
          {/* Theme accent */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5 md:h-2"
            style={{ backgroundColor: themeColor }}
          />
          
          <div 
            className="w-16 h-16 md:w-24 md:h-24 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center text-2xl md:text-3xl font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
          >
            {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{profile.full_name}</h1>
          <p className="text-muted-foreground text-sm md:text-base mb-2">@{profile.user_code}</p>
          
          {profile.bio && (
            <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto mb-3 md:mb-4">{profile.bio}</p>
          )}
          
          {/* Follow Stats */}
          <div className="flex justify-center gap-4 md:gap-6 mb-3 md:mb-4">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold">{followers?.length || 0}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold">{following?.length || 0}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Following</p>
            </div>
          </div>
          
          <div className="flex justify-center mb-3 md:mb-4">
            <StarRating rating={Number(profile.star_rating)} size="lg" />
          </div>
          
          <div className="flex justify-center gap-4 md:gap-8 text-center mb-4 md:mb-6">
            <div>
              <p className="text-lg md:text-2xl font-bold">{profile.total_achievements}</p>
              <p className="text-[10px] md:text-sm text-muted-foreground">Achievements</p>
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold">{profile.verified_achievements}</p>
              <p className="text-[10px] md:text-sm text-muted-foreground">Verified</p>
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold">{Number(profile.star_rating).toFixed(1)}</p>
              <p className="text-[10px] md:text-sm text-muted-foreground">Stars</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-2">
            {isOwnProfile ? (
              <ProfileSettings profile={profile} />
            ) : (
              <FollowButton targetUserId={profile.id} />
            )}
          </div>
        </motion.div>

        {/* About Section */}
        {profile.about && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-4 md:p-6 mb-6 md:mb-8"
          >
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" style={{ color: themeColor }} />
              About
            </h2>
            <p className="text-muted-foreground text-sm md:text-base whitespace-pre-wrap">{profile.about}</p>
          </motion.div>
        )}

        {/* Skills & Interests */}
        {((profile.skills && profile.skills.length > 0) || (profile.interests && profile.interests.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8"
          >
            {profile.skills && profile.skills.length > 0 && (
              <div className="glass-card p-4 md:p-6">
                <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" style={{ color: themeColor }} />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {profile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm"
                      style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.interests && profile.interests.length > 0 && (
              <div className="glass-card p-4 md:p-6">
                <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 md:w-5 md:h-5" style={{ color: themeColor }} />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {profile.interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm bg-muted text-muted-foreground"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 md:mb-8"
        >
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <Copy className="w-4 h-4 md:w-5 md:h-5" style={{ color: themeColor }} />
            Digital Identity Card
          </h2>
          <IdentityCard
            name={profile.full_name}
            userCode={profile.user_code}
            starRating={Number(profile.star_rating)}
            totalAchievements={profile.total_achievements}
          />
        </motion.div>

        {/* Badges */}
        {userBadges && userBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-6 mb-6 md:mb-8"
          >
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 md:w-5 md:h-5" style={{ color: themeColor }} />
              Earned Badges
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {userBadges.map((ub) => (
                <Badge
                  key={ub.id}
                  name={ub.badges.name}
                  icon={ub.badges.icon}
                  color={ub.badges.color}
                  description={ub.badges.description}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Verified Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 md:w-5 md:h-5" style={{ color: themeColor }} />
            Verified Achievements
          </h2>
          
          {achievements && achievements.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  id={achievement.id}
                  title={achievement.title}
                  description={achievement.description || undefined}
                  category={achievement.categories?.name || 'Unknown'}
                  categoryColor={achievement.categories?.color || undefined}
                  date={achievement.achievement_date || undefined}
                  proofUrl={achievement.proof_url || undefined}
                  status={achievement.status}
                  showSocialActions
                  likesCount={achievement.likes_count || 0}
                  isPinned={achievement.is_pinned || false}
                  userCode={profile.user_code}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 md:p-8 text-center">
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-sm md:text-base">No verified achievements yet.</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 border-t border-border/50 mt-8 md:mt-12">
        <div className="container mx-auto text-center text-xs md:text-sm text-muted-foreground">
          <p>© 2024 SkyLine. Celebrate your achievements.</p>
        </div>
      </footer>
    </div>
  );
}
