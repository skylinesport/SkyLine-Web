import { motion } from 'framer-motion';
import { ArrowRight, Star, Trophy, Users, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { LeaderboardCard } from '@/components/LeaderboardCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { user } = useAuth();

  const { data: topUsers } = useQuery({
    queryKey: ['leaderboard-top5'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, star_rating, total_achievements')
        .order('star_rating', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen hero-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <Star className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gold-text">LocaTrack</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button className="gold-gradient text-primary-foreground font-semibold">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="gold-gradient text-primary-foreground font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Track Your Life Achievements</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Celebrate Your
              <br />
              <span className="gold-text">Non-Academic Wins</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Track sports, arts, volunteering, and more. Build your digital identity 
              with verified achievements and climb the leaderboard.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
                <Button size="lg" className="gold-gradient text-primary-foreground font-semibold h-12 px-8">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Demo Stars */}
            <div className="mt-12 flex justify-center">
              <div className="glass-card px-8 py-4">
                <p className="text-sm text-muted-foreground mb-2">Earn up to 7 stars</p>
                <StarRating rating={5.5} size="xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Trophy, title: 'Track Achievements', desc: 'Sports, dance, art, volunteering, and more' },
              { icon: Star, title: 'Earn Stars', desc: 'Dynamic 0-7 star rating based on your accomplishments' },
              { icon: Award, title: 'Get Verified', desc: 'Verified achievements carry more weight' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl gold-gradient mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Top Achievers</span>
            </div>
            <h2 className="text-3xl font-bold">Leaderboard</h2>
          </div>

          <div className="space-y-3">
            {topUsers && topUsers.length > 0 ? (
              topUsers.map((user, index) => (
                <LeaderboardCard
                  key={user.id}
                  rank={index + 1}
                  name={user.full_name}
                  avatarUrl={user.avatar_url || undefined}
                  starRating={Number(user.star_rating)}
                  achievementCount={user.total_achievements}
                />
              ))
            ) : (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Be the first to join the leaderboard!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 LocaTrack. Celebrate your achievements.</p>
        </div>
      </footer>
    </div>
  );
}
