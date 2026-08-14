import { motion } from 'framer-motion';
import { Crown, Medal, Award } from 'lucide-react';
import { StarRating } from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface LeaderboardCardProps {
  rank: number;
  name: string;
  avatarUrl?: string;
  starRating: number;
  achievementCount: number;
  onClick?: () => void;
}

export function LeaderboardCard({
  rank,
  name,
  avatarUrl,
  starRating,
  achievementCount,
  onClick,
}: LeaderboardCardProps) {
  const rankConfig: Record<number, { icon: typeof Crown; color: string; bgColor: string }> = {
    1: { icon: Crown, color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.15)' },
    2: { icon: Medal, color: '#C0C0C0', bgColor: 'rgba(192, 192, 192, 0.15)' },
    3: { icon: Award, color: '#CD7F32', bgColor: 'rgba(205, 127, 50, 0.15)' },
  };

  const RankIcon = rankConfig[rank]?.icon;
  const isTopThree = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "glass-card p-4 cursor-pointer transition-all",
        isTopThree && "border-2",
        rank === 1 && "border-[#FFD700]/50"
      )}
      style={isTopThree ? { borderColor: `${rankConfig[rank].color}50` } : {}}
    >
      <div className="flex items-center gap-4">
        {/* Rank indicator */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
            isTopThree ? "" : "bg-muted text-muted-foreground"
          )}
          style={isTopThree ? {
            backgroundColor: rankConfig[rank].bgColor,
            color: rankConfig[rank].color,
          } : {}}
        >
          {RankIcon ? (
            <RankIcon className="w-5 h-5" />
          ) : (
            rank
          )}
        </div>

        {/* Avatar */}
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {achievementCount} achievement{achievementCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Star rating */}
        <div className="flex flex-col items-end">
          <StarRating rating={starRating} size="sm" animated={false} />
          <span className="text-xs text-muted-foreground mt-1">
            {starRating.toFixed(1)} stars
          </span>
        </div>
      </div>
    </motion.div>
  );
}
