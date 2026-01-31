import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export function FollowButton({ targetUserId, className }: FollowButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isFollowing, isLoading: checkingFollow } = useQuery({
    queryKey: ['is-following', user?.id, targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user?.id)
        .eq('following_id', targetUserId)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id && user?.id !== targetUserId,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('followers')
        .insert({ follower_id: user?.id, following_id: targetUserId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following', user?.id, targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['public-profile'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      toast.success('Following!');
    },
    onError: () => toast.error('Failed to follow'),
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user?.id)
        .eq('following_id', targetUserId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following', user?.id, targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['public-profile'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      toast.success('Unfollowed');
    },
    onError: () => toast.error('Failed to unfollow'),
  });

  if (!user || user.id === targetUserId) return null;

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={() => isFollowing ? unfollowMutation.mutate() : followMutation.mutate()}
      disabled={isPending || checkingFollow}
      className={className}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}
