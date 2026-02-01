import { useState } from 'react';
import { Search, Shield, ShieldOff, User, Trash2, Ban, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function UserManagement() {
  const [search, setSearch] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [restrictUserId, setRestrictUserId] = useState<string | null>(null);
  const [restrictReason, setRestrictReason] = useState('');
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,user_code.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: adminUsers } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      if (error) throw error;
      return data?.map((r) => r.user_id) || [];
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isAdmin }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast.success(isAdmin ? 'Admin role removed' : 'Admin role granted');
    },
    onError: () => toast.error('Failed to update role'),
  });

  const restrictUser = useMutation({
    mutationFn: async ({ userId, restrict, reason }: { userId: string; restrict: boolean; reason?: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_restricted: restrict,
          restriction_reason: restrict ? reason : null,
          restricted_at: restrict ? new Date().toISOString() : null,
          restricted_by: restrict ? currentUser?.id : null,
        })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: (_, { restrict }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(restrict ? 'User account restricted' : 'User account unrestricted');
      setRestrictUserId(null);
      setRestrictReason('');
    },
    onError: () => toast.error('Failed to update restriction'),
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // Delete user's achievements first
      await supabase.from('achievements').delete().eq('user_id', userId);
      // Delete user's badges
      await supabase.from('user_badges').delete().eq('user_id', userId);
      // Delete user's notifications
      await supabase.from('notifications').delete().eq('user_id', userId);
      // Delete user's followers/following
      await supabase.from('followers').delete().or(`follower_id.eq.${userId},following_id.eq.${userId}`);
      // Delete user's likes
      await supabase.from('achievement_likes').delete().eq('user_id', userId);
      // Delete user roles
      await supabase.from('user_roles').delete().eq('user_id', userId);
      // Finally delete the profile
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast.success('User account deleted');
      setDeleteUserId(null);
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const isUserAdmin = (userId: string) => adminUsers?.includes(userId) || false;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {users?.length || 0} users
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : users && users.length > 0 ? (
          users.map((user) => {
            const userIsAdmin = isUserAdmin(user.id);
            const isCurrentUser = user.id === currentUser?.id;
            return (
              <div key={user.id} className={`glass-card p-4 ${user.is_restricted ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
                    {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.full_name}</p>
                    <Link 
                      to={`/profile/${user.user_code}`}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {user.user_code}
                    </Link>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {user.is_restricted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-medium">
                          <Ban className="w-2.5 h-2.5" />
                          Restricted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-medium">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Active
                        </span>
                      )}
                      {userIsAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                          <Shield className="w-2.5 h-2.5" />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!isCurrentUser && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => toggleAdmin.mutate({ userId: user.id, isAdmin: userIsAdmin })}
                    >
                      {userIsAdmin ? <ShieldOff className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                      {userIsAdmin ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                    {!userIsAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            if (user.is_restricted) {
                              restrictUser.mutate({ userId: user.id, restrict: false });
                            } else {
                              setRestrictUserId(user.id);
                            }
                          }}
                        >
                          {user.is_restricted ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass-card p-8 text-center text-muted-foreground">
            No users found
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Star Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-pulse text-muted-foreground">Loading users...</div>
                </TableCell>
              </TableRow>
            ) : users && users.length > 0 ? (
              users.map((user) => {
                const userIsAdmin = isUserAdmin(user.id);
                const isCurrentUser = user.id === currentUser?.id;
                return (
                  <TableRow key={user.id} className={user.is_restricted ? 'opacity-60' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/profile/${user.user_code}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {user.user_code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={Number(user.star_rating)} size="sm" />
                    </TableCell>
                    <TableCell>
                      {user.is_restricted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
                          <Ban className="w-3 h-3" />
                          Restricted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {userIsAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          <User className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Admin */}
                        {!isCurrentUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAdmin.mutate({ userId: user.id, isAdmin: userIsAdmin })}
                            title={userIsAdmin ? 'Remove admin' : 'Make admin'}
                          >
                            {userIsAdmin ? (
                              <ShieldOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Shield className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        )}
                        
                        {/* Toggle Restriction */}
                        {!isCurrentUser && !userIsAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (user.is_restricted) {
                                restrictUser.mutate({ userId: user.id, restrict: false });
                              } else {
                                setRestrictUserId(user.id);
                              }
                            }}
                            title={user.is_restricted ? 'Unrestrict user' : 'Restrict user'}
                          >
                            {user.is_restricted ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <Ban className="w-4 h-4 text-warning" />
                            )}
                          </Button>
                        )}
                        
                        {/* Delete User */}
                        {!isCurrentUser && !userIsAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteUserId(user.id)}
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete the user's account
              and all their data including achievements, badges, and followers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && deleteUser.mutate(deleteUserId)}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restrict User Dialog */}
      <Dialog open={!!restrictUserId} onOpenChange={() => setRestrictUserId(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Restrict User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Restricting a user will prevent them from accessing their dashboard. 
              They will see a message explaining their account is restricted.
            </p>
            <div>
              <Label>Reason for restriction</Label>
              <Textarea
                value={restrictReason}
                onChange={(e) => setRestrictReason(e.target.value)}
                placeholder="Explain why this account is being restricted..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setRestrictUserId(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => restrictUserId && restrictUser.mutate({ 
                userId: restrictUserId, 
                restrict: true, 
                reason: restrictReason 
              })}
            >
              Restrict Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}