import { useState } from 'react';
import { Search, Shield, ShieldOff, User, Star } from 'lucide-react';
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
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export function UserManagement() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('star_rating', { ascending: false })
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

  const isUserAdmin = (userId: string) => adminUsers?.includes(userId) || false;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Star Rating</TableHead>
              <TableHead>Achievements</TableHead>
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
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
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
                      <span className="text-sm">
                        {user.verified_achievements}/{user.total_achievements}
                      </span>
                    </TableCell>
                    <TableCell>
                      {userIsAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
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
                      <Button
                        variant={userIsAdmin ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleAdmin.mutate({ userId: user.id, isAdmin: userIsAdmin })}
                      >
                        {userIsAdmin ? (
                          <>
                            <ShieldOff className="w-4 h-4 mr-1" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-1" />
                            Make Admin
                          </>
                        )}
                      </Button>
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
    </div>
  );
}
