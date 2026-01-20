import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
}

export function StarRating({ 
  rating, 
  maxRating = 7, 
  size = 'md',
  showLabel = false,
  animated = true
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const stars = Array.from({ length: maxRating }, (_, i) => {
    const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
    const isFullyFilled = fillPercentage === 100;
    const isPartiallyFilled = fillPercentage > 0 && fillPercentage < 100;
    
    return { index: i, fillPercentage, isFullyFilled, isPartiallyFilled };
  });

  const StarComponent = animated ? motion.div : 'div';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map(({ index, fillPercentage, isFullyFilled, isPartiallyFilled }) => (
          <StarComponent
            key={index}
            {...(animated ? {
              initial: { scale: 0, rotate: -180 },
              animate: { scale: 1, rotate: 0 },
              transition: { delay: index * 0.1, type: "spring", stiffness: 200 }
            } : {})}
            className="relative"
          >
            {/* Background star */}
            <Star 
              className={cn(
                sizeClasses[size],
                "text-muted-foreground/30"
              )}
            />
            
            {/* Filled overlay */}
            {(isFullyFilled || isPartiallyFilled) && (
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star 
                  className={cn(
                    sizeClasses[size],
                    "text-primary fill-primary star-glow"
                  )}
                />
              </div>
            )}
          </StarComponent>
        ))}
      </div>
      
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
}
