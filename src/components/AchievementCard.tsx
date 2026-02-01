import { motion } from 'framer-motion';
import { Calendar, ExternalLink, CheckCircle2, Clock, XCircle, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LikeButton } from '@/components/LikeButton';
import { ShareButton } from '@/components/ShareButton';
import { PinButton } from '@/components/PinButton';

interface AchievementCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  categoryColor?: string;
  date?: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  showActions?: boolean;
  showSocialActions?: boolean;
  likesCount?: number;
  isPinned?: boolean;
  userCode?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AchievementCard({
  id,
  title,
  description,
  category,
  categoryColor = 'hsl(var(--primary))',
  date,
  proofUrl,
  status,
  showActions = false,
  showSocialActions = false,
  likesCount = 0,
  isPinned = false,
  userCode,
  onEdit,
  onDelete,
}: AchievementCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Pending',
      className: 'bg-warning/20 text-warning border-warning/30',
    },
    approved: {
      icon: CheckCircle2,
      label: 'Verified',
      className: 'bg-success/20 text-success border-success/30',
    },
    rejected: {
      icon: XCircle,
      label: 'Rejected',
      className: 'bg-destructive/20 text-destructive border-destructive/30',
    },
  };

  const StatusIcon = statusConfig[status].icon;
  const shareUrl = userCode 
    ? `${window.location.origin}/profile/${userCode}#achievement-${id}`
    : window.location.href;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn("glass-card p-4 md:p-5 group", isPinned && "ring-2 ring-primary/50")}
      id={`achievement-${id}`}
    >
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
            <span
              className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                border: `1px solid ${categoryColor}40`,
              }}
            >
              {category}
            </span>
            
            <span className={cn(
              "inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border",
              statusConfig[status].className
            )}>
              <StatusIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
              {statusConfig[status].label}
            </span>

            {isPinned && (
              <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                📌 <span className="hidden sm:inline ml-1">Pinned</span>
              </span>
            )}
          </div>
          
          <h3 className="text-base md:text-lg font-semibold text-foreground truncate">{title}</h3>
          
          {description && (
            <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          )}
          
          <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3 flex-wrap">
            {date && (
              <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                {format(new Date(date), 'MMM d, yyyy')}
              </div>
            )}
            
            {proofUrl && (
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                View Proof
              </a>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {showActions && (
            <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <PinButton achievementId={id} isPinned={isPinned} />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-foreground"
                onClick={onEdit}
              >
                <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
          )}
          
          {(showSocialActions || status === 'approved') && (
            <div className="flex items-center gap-1">
              <LikeButton achievementId={id} likesCount={likesCount} />
              <ShareButton title={title} url={shareUrl} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
