import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PinButtonProps {
  achievementId: string;
  isPinned: boolean;
  className?: string;
}

export function PinButton({ achievementId, isPinned, className }: PinButtonProps) {
  const queryClient = useQueryClient();

  const togglePinMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('achievements')
        .update({ is_pinned: !isPinned })
        .eq('id', achievementId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['public-achievements'] });
      toast.success(isPinned ? 'Unpinned' : 'Pinned to top!');
    },
    onError: () => toast.error('Failed to update'),
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => togglePinMutation.mutate()}
      disabled={togglePinMutation.isPending}
      className={cn("h-8 w-8", className)}
    >
      {togglePinMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Pin
          className={cn(
            "w-4 h-4 transition-colors",
            isPinned ? "fill-primary text-primary" : "text-muted-foreground"
          )}
        />
      )}
    </Button>
  );
}
