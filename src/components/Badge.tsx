import { motion } from 'framer-motion';
import { Star, Target, Layers, Trophy, Palette, Heart, BadgeCheck, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  name: string;
  icon: string;
  color: string;
  description?: string;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star,
  target: Target,
  layers: Layers,
  trophy: Trophy,
  palette: Palette,
  heart: Heart,
  'badge-check': BadgeCheck,
  crown: Crown,
};

export function Badge({
  name,
  icon,
  color,
  description,
  earned = true,
  size = 'md',
  showTooltip = true
}: BadgeProps) {
  const IconComponent = iconMap[icon] || Star;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="group relative"
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center badge-shimmer",
          sizeClasses[size],
          earned ? "" : "opacity-30 grayscale"
        )}
        style={{
          background: earned 
            ? `linear-gradient(135deg, ${color}40, ${color}20)` 
            : 'hsl(var(--muted))',
          border: `2px solid ${earned ? color : 'hsl(var(--border))'}`,
          boxShadow: earned ? `0 4px 20px ${color}40` : 'none',
        }}
      >
        <IconComponent 
          className={iconSizes[size]}
          style={{ color: earned ? color : 'hsl(var(--muted-foreground))' }}
        />
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <p className="text-sm font-medium text-foreground">{name}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
