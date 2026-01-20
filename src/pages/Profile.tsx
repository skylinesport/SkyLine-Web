import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Trophy, Award, Share2, Copy, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { AchievementCard } from '@/components/AchievementCard';
import { Badge } from '@/components/Badge';
import { IdentityCard } from '@/components/IdentityCard';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const { userCode } = useParams<{ userCode: string }>();
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Profile link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <Star className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gold-text">LocaTrack</span>
          </Link>
          
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
          <p className="text-muted-foreground mb-4">@{profile.user_code}</p>
          
          {profile.bio && (
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{profile.bio}</p>
          )}
          
          <div className="flex justify-center mb-4">
            <StarRating rating={Number(profile.star_rating)} size="xl" />
          </div>
          
          <div className="flex justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-bold">{profile.total_achievements}</p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.verified_achievements}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{Number(profile.star_rating).toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Stars</p>
            </div>
          </div>
        </motion.div>

        {/* Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Copy className="w-5 h-5 text-primary" />
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
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Earned Badges
            </h2>
            <div className="flex flex-wrap gap-4">
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
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Verified Achievements
          </h2>
          
          {achievements && achievements.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
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
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No verified achievements yet.</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 LocaTrack. Celebrate your achievements.</p>
        </div>
      </footer>
    </div>
  );
}
