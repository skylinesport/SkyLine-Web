import { motion } from 'framer-motion';
import { Calendar, ExternalLink, CheckCircle2, Clock, XCircle, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card p-5 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                border: `1px solid ${categoryColor}40`,
              }}
            >
              {category}
            </span>
            
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
              statusConfig[status].className
            )}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig[status].label}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground truncate">{title}</h3>
          
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          )}
          
          <div className="flex items-center gap-4 mt-3">
            {date && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(date), 'MMM d, yyyy')}
              </div>
            )}
            
            {proofUrl && (
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Proof
              </a>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
