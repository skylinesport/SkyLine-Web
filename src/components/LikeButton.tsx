import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LikeButtonProps {
  achievementId: string;
  likesCount?: number;
  className?: string;
}

export function LikeButton({ achievementId, likesCount = 0, className }: LikeButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isLiked } = useQuery({
    queryKey: ['achievement-liked', achievementId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievement_likes')
        .select('id')
        .eq('achievement_id', achievementId)
        .eq('user_id', user?.id)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('achievement_likes')
        .insert({ achievement_id: achievementId, user_id: user?.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievement-liked', achievementId] });
      queryClient.invalidateQueries({ queryKey: ['public-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
    onError: () => toast.error('Failed to like'),
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('achievement_likes')
        .delete()
        .eq('achievement_id', achievementId)
        .eq('user_id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievement-liked', achievementId] });
      queryClient.invalidateQueries({ queryKey: ['public-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
    onError: () => toast.error('Failed to unlike'),
  });

  const handleClick = () => {
    if (!user) {
      toast.error('Please sign in to like');
      return;
    }
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={cn("gap-1.5", className)}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
        />
      )}
      <span className="text-xs">{likesCount}</span>
    </Button>
  );
}
