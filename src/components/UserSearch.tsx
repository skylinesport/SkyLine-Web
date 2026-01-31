import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';

export function UserSearch() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['search-users', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, user_code, star_rating, avatar_url')
        .or(`full_name.ilike.%${searchTerm}%,user_code.ilike.%${searchTerm}%`)
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length >= 2,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or user code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          <div className="max-h-80 overflow-y-auto space-y-2">
            {isLoading && searchTerm.length >= 2 && (
              <p className="text-sm text-muted-foreground text-center py-4">Searching...</p>
            )}
            
            {users && users.length > 0 ? (
              users.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.user_code}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">@{user.user_code}</p>
                  </div>
                  <StarRating rating={Number(user.star_rating)} size="sm" />
                </Link>
              ))
            ) : searchTerm.length >= 2 && !isLoading ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Type at least 2 characters to search
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
