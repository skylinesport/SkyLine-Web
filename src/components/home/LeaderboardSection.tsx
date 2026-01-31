import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StarRating } from '@/components/StarRating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TimeFilter = 'all' | 'month' | 'year';

// Smooth easing curve - typed as tuple
const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

// Staggered container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

export function LeaderboardSection() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: topUsers } = useQuery({
    queryKey: ['leaderboard', timeFilter, categoryFilter],
    queryFn: async () => {
      if (timeFilter === 'all' && categoryFilter === 'all') {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, star_rating, total_achievements, user_code')
          .order('star_rating', { ascending: false })
          .limit(10);
        if (error) throw error;
        return data;
      }

      let query = supabase
        .from('achievements')
        .select('user_id, category_id, status, created_at')
        .eq('status', 'approved');

      if (timeFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('created_at', monthAgo.toISOString());
      } else if (timeFilter === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        query = query.gte('created_at', yearAgo.toISOString());
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category_id', categoryFilter);
      }

      const { data: achievements, error: achError } = await query;
      if (achError) throw achError;

      const userCounts: Record<string, number> = {};
      achievements?.forEach((a) => {
        userCounts[a.user_id] = (userCounts[a.user_id] || 0) + 1;
      });

      const topUserIds = Object.entries(userCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([id]) => id);

      if (topUserIds.length === 0) return [];

      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, star_rating, total_achievements, user_code')
        .in('id', topUserIds);
      if (profError) throw profError;

      return profiles?.sort((a, b) => (userCounts[b.id] || 0) - (userCounts[a.id] || 0)) || [];
    },
  });

  return (
    <section id="leaderboard" className="py-24 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex items-baseline gap-4 mb-4"
          >
            <span className="text-muted-foreground text-sm font-medium">02</span>
            <span className="text-muted-foreground text-sm">/Showcase</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
            className="flex items-baseline gap-4 mb-2"
          >
            <span className="text-muted-foreground text-sm">2024-2025</span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: smoothEase }}
              className="text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[0.9] tracking-tighter"
            >
              Featured<span className="gold-text">achievers</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.3 }}
            className="text-muted-foreground mt-4 max-w-xl text-lg"
          >
            A collection of top performers that showcase excellence in non-academic achievements.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: smoothEase, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
              <SelectTrigger className="w-32 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 border-border">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Leaderboard Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid gap-4"
        >
          {topUsers && topUsers.length > 0 ? (
            topUsers.map((user, index) => (
              <motion.div key={user.id} variants={rowVariants}>
                <Link to={`/profile/${user.user_code}`}>
                  <LeaderboardRow
                    rank={index + 1}
                    name={user.full_name}
                    avatarUrl={user.avatar_url || undefined}
                    starRating={Number(user.star_rating)}
                    achievementCount={user.total_achievements}
                  />
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <p className="text-muted-foreground text-lg">
                Be the first to join the leaderboard!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

interface LeaderboardRowProps {
  rank: number;
  name: string;
  avatarUrl?: string;
  starRating: number;
  achievementCount: number;
}

function LeaderboardRow({ rank, name, avatarUrl, starRating, achievementCount }: LeaderboardRowProps) {
  const isTop3 = rank <= 3;
  
  return (
    <div className={`group flex items-center gap-6 p-6 rounded-2xl border transition-all duration-300 hover:border-primary/50 hover:bg-muted/30 ${isTop3 ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
      {/* Rank */}
      <div className={`text-4xl font-extrabold w-16 ${isTop3 ? 'gold-text' : 'text-muted-foreground'}`}>
        {String(rank).padStart(2, '0')}
      </div>

      {/* Avatar */}
      <div className="relative">
        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${isTop3 ? 'border-primary' : 'border-border'}`}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold truncate group-hover:gold-text transition-colors duration-300">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm">
          {achievementCount} achievement{achievementCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Star Rating */}
      <div className="hidden md:block">
        <StarRating rating={starRating} size="md" />
      </div>

      {/* Arrow */}
      <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
        →
      </div>
    </div>
  );
}
