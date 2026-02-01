import { useState } from 'react';
import { Check, X, ExternalLink, Clock, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export function AchievementModeration() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const queryClient = useQueryClient();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['admin-achievements', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('achievements')
        .select('*, categories(name, color), profiles!achievements_user_id_fkey(full_name, user_code)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as 'pending' | 'approved' | 'rejected');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('achievements')
        .update({ 
          status,
          verified_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
      toast.success(`Achievement ${status}`);
    },
    onError: () => toast.error('Failed to update achievement'),
  });

  const statusColors = {
    pending: 'bg-warning/20 text-warning',
    approved: 'bg-success/20 text-success',
    rejected: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'pending' | 'approved' | 'rejected')}>
            <SelectTrigger className="w-32 sm:w-40 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : achievements && achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div key={achievement.id} className="glass-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{achievement.title}</p>
                  <Link
                    to={`/profile/${achievement.profiles?.user_code}`}
                    className="text-primary hover:underline text-xs"
                  >
                    {achievement.profiles?.full_name}
                  </Link>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[achievement.status as keyof typeof statusColors]}`}>
                  <Clock className="w-2.5 h-2.5" />
                  {achievement.status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: `${achievement.categories?.color}20`,
                    color: achievement.categories?.color,
                  }}
                >
                  {achievement.categories?.name}
                </span>
                {achievement.proof_url && (
                  <a
                    href={achievement.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Proof
                  </a>
                )}
              </div>
              {achievement.status === 'pending' && (
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-success border-success/30 hover:bg-success/10 text-xs"
                    onClick={() => updateStatus.mutate({ id: achievement.id, status: 'approved' })}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10 text-xs"
                    onClick={() => updateStatus.mutate({ id: achievement.id, status: 'rejected' })}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-card p-8 text-center text-muted-foreground">
            No achievements found
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Achievement</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-pulse text-muted-foreground">Loading achievements...</div>
                </TableCell>
              </TableRow>
            ) : achievements && achievements.length > 0 ? (
              achievements.map((achievement) => (
                <TableRow key={achievement.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      {achievement.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{achievement.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/profile/${achievement.profiles?.user_code}`}
                      className="text-primary hover:underline text-sm"
                    >
                      {achievement.profiles?.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${achievement.categories?.color}20`,
                        color: achievement.categories?.color,
                      }}
                    >
                      {achievement.categories?.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {achievement.achievement_date
                      ? format(new Date(achievement.achievement_date), 'MMM d, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[achievement.status as keyof typeof statusColors]}`}>
                      <Clock className="w-3 h-3" />
                      {achievement.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {achievement.proof_url ? (
                      <a
                        href={achievement.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {achievement.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-success border-success/30 hover:bg-success/10"
                          onClick={() => updateStatus.mutate({ id: achievement.id, status: 'approved' })}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => updateStatus.mutate({ id: achievement.id, status: 'rejected' })}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {achievement.status !== 'pending' && (
                      <span className="text-xs text-muted-foreground">
                        {achievement.status === 'approved' ? 'Verified' : 'Rejected'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No achievements found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
