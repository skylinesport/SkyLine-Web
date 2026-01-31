import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, LogOut, User, Trophy, TrendingUp, Award, Copy } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { ProgressBar } from '@/components/ProgressBar';
import { AchievementCard } from '@/components/AchievementCard';
import { Badge } from '@/components/Badge';
import { IdentityCard } from '@/components/IdentityCard';
import { NotificationBell } from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserSearch } from '@/components/UserSearch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AchievementForm {
  title: string;
  description: string;
  category_id: string;
  achievement_date: string;
  proof_url: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<string | null>(null);
  const [form, setForm] = useState<AchievementForm>({
    title: '', description: '', category_id: '', achievement_date: '', proof_url: ''
  });

  // Redirect admins to admin panel
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

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
        .order('is_pinned', { ascending: false })
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
        title: form.title,
        description: form.description || null,
        category_id: form.category_id,
        achievement_date: form.achievement_date || null,
        proof_url: form.proof_url || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      closeDialog();
      toast.success('Achievement added!');
    },
    onError: () => toast.error('Failed to add achievement'),
  });

  const updateAchievement = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('achievements')
        .update({
          title: form.title,
          description: form.description || null,
          category_id: form.category_id,
          achievement_date: form.achievement_date || null,
          proof_url: form.proof_url || null,
        })
        .eq('id', editingAchievement);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      closeDialog();
      toast.success('Achievement updated!');
    },
    onError: () => toast.error('Failed to update achievement'),
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

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAchievement(null);
    setForm({ title: '', description: '', category_id: '', achievement_date: '', proof_url: '' });
  };

  const handleEdit = (achievement: any) => {
    setEditingAchievement(achievement.id);
    setForm({
      title: achievement.title,
      description: achievement.description || '',
      category_id: achievement.category_id,
      achievement_date: achievement.achievement_date || '',
      proof_url: achievement.proof_url || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAchievement) {
      updateAchievement.mutate();
    } else {
      addAchievement.mutate();
    }
  };

  const starRating = Number(profile?.star_rating || 0);
  const nextStar = Math.ceil(starRating) || 1;
  const progressToNext = nextStar > 0 ? ((starRating % 1) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="SkyLine" className="h-8 w-auto dark:invert" />
          </Link>
          
          <div className="flex items-center gap-2">
            <UserSearch />
            <ThemeToggle />
            <NotificationBell />
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

          {/* Identity Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Copy className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Your Digital ID</h2>
            </div>
            {profile && (
              <IdentityCard
                name={profile.full_name}
                userCode={profile.user_code}
                starRating={Number(profile.star_rating)}
                totalAchievements={profile.total_achievements}
              />
            )}
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 glass-card p-6">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Achievements</h2>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                if (!open) closeDialog();
                else setDialogOpen(true);
              }}>
                <DialogTrigger asChild>
                  <Button className="gold-gradient text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" /> Add Achievement
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Title *</Label>
                      <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
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
                      <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={form.achievement_date} onChange={(e) => setForm({ ...form, achievement_date: e.target.value })} />
                    </div>
                    <div>
                      <Label>Proof URL</Label>
                      <Input value={form.proof_url} onChange={(e) => setForm({ ...form, proof_url: e.target.value })} placeholder="https://..." />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={addAchievement.isPending || updateAchievement.isPending || !form.title || !form.category_id} 
                      className="w-full gold-gradient text-primary-foreground"
                    >
                      {addAchievement.isPending || updateAchievement.isPending ? 'Saving...' : (editingAchievement ? 'Update Achievement' : 'Add Achievement')}
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
                    isPinned={achievement.is_pinned || false}
                    likesCount={achievement.likes_count || 0}
                    userCode={profile?.user_code}
                    onEdit={() => handleEdit(achievement)}
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
