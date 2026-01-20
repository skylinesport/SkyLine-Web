import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, LogOut, User, Trophy, TrendingUp, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { ProgressBar } from '@/components/ProgressBar';
import { AchievementCard } from '@/components/AchievementCard';
import { Badge } from '@/components/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '', description: '', category_id: '', achievement_date: '', proof_url: ''
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*, categories(name, color)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: userBadges } = useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const addAchievement = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('achievements').insert({
        user_id: user?.id,
        title: newAchievement.title,
        description: newAchievement.description || null,
        category_id: newAchievement.category_id,
        achievement_date: newAchievement.achievement_date || null,
        proof_url: newAchievement.proof_url || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setDialogOpen(false);
      setNewAchievement({ title: '', description: '', category_id: '', achievement_date: '', proof_url: '' });
      toast.success('Achievement added!');
    },
    onError: () => toast.error('Failed to add achievement'),
  });

  const deleteAchievement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Achievement deleted');
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const starRating = Number(profile?.star_rating || 0);
  const nextStar = Math.ceil(starRating) || 1;
  const progressToNext = nextStar > 0 ? ((starRating % 1) * 100) : 0;

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
          
          <div className="flex items-center gap-3">
            <Link to={`/profile/${profile?.user_code}`}>
              <Button variant="ghost" size="icon"><User className="w-5 h-5" /></Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 grid md:grid-cols-3 gap-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Star Rating</p>
                  <p className="text-2xl font-bold">{starRating.toFixed(1)}</p>
                </div>
              </div>
              <StarRating rating={starRating} size="md" />
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Achievements</p>
                  <p className="text-2xl font-bold">{profile?.total_achievements || 0}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{profile?.verified_achievements || 0} verified</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Star</p>
                  <p className="text-2xl font-bold">{nextStar <= 7 ? `★${nextStar}` : 'MAX'}</p>
                </div>
              </div>
              <ProgressBar value={progressToNext} max={100} showPercentage={false} size="sm" />
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Your Badges</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {userBadges && userBadges.length > 0 ? (
                userBadges.map((ub) => (
                  <Badge key={ub.id} name={ub.badges.name} icon={ub.badges.icon} color={ub.badges.color} description={ub.badges.description} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Complete achievements to earn badges!</p>
              )}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Achievements</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gold-gradient text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" /> Add Achievement
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Add New Achievement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); addAchievement.mutate(); }} className="space-y-4">
                    <div>
                      <Label>Title *</Label>
                      <Input value={newAchievement.title} onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select value={newAchievement.category_id} onValueChange={(v) => setNewAchievement({ ...newAchievement, category_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={newAchievement.description} onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={newAchievement.achievement_date} onChange={(e) => setNewAchievement({ ...newAchievement, achievement_date: e.target.value })} />
                    </div>
                    <div>
                      <Label>Proof URL</Label>
                      <Input value={newAchievement.proof_url} onChange={(e) => setNewAchievement({ ...newAchievement, proof_url: e.target.value })} placeholder="https://..." />
                    </div>
                    <Button type="submit" disabled={addAchievement.isPending || !newAchievement.title || !newAchievement.category_id} className="w-full gold-gradient text-primary-foreground">
                      {addAchievement.isPending ? 'Adding...' : 'Add Achievement'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {achievements && achievements.length > 0 ? (
                achievements.map((achievement) => (
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
                    showActions
                    onDelete={() => deleteAchievement.mutate(achievement.id)}
                  />
                ))
              ) : (
                <div className="md:col-span-2 glass-card p-12 text-center">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet. Add your first one!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
