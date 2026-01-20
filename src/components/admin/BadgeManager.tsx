import { useState } from 'react';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface BadgeForm {
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement_type: string;
  requirement_value: number;
}

const requirementTypes = [
  { value: 'star_rating', label: 'Star Rating' },
  { value: 'total_achievements', label: 'Total Achievements' },
  { value: 'category_count', label: 'Categories Covered' },
  { value: 'sports_achievements', label: 'Sports Achievements' },
  { value: 'creative_achievements', label: 'Creative Achievements' },
  { value: 'volunteering_achievements', label: 'Volunteering Achievements' },
  { value: 'certifications', label: 'Certifications' },
];

export function BadgeManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BadgeForm>({
    name: '',
    description: '',
    icon: '🏅',
    color: '#d4a44c',
    requirement_type: 'total_achievements',
    requirement_value: 5,
  });

  const { data: badges, isLoading } = useQuery({
    queryKey: ['admin-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value');
      if (error) throw error;
      return data;
    },
  });

  const createBadge = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('badges').insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      setDialogOpen(false);
      resetForm();
      toast.success('Badge created');
    },
    onError: () => toast.error('Failed to create badge'),
  });

  const updateBadge = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('badges')
        .update(form)
        .eq('id', editingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      setDialogOpen(false);
      resetForm();
      toast.success('Badge updated');
    },
    onError: () => toast.error('Failed to update badge'),
  });

  const deleteBadge = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('badges').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      toast.success('Badge deleted');
    },
    onError: () => toast.error('Failed to delete badge'),
  });

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      icon: '🏅',
      color: '#d4a44c',
      requirement_type: 'total_achievements',
      requirement_value: 5,
    });
    setEditingId(null);
  };

  const handleEdit = (badge: any) => {
    setEditingId(badge.id);
    setForm({
      name: badge.name,
      description: badge.description || '',
      icon: badge.icon,
      color: badge.color,
      requirement_type: badge.requirement_type,
      requirement_value: badge.requirement_value,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBadge.mutate();
    } else {
      createBadge.mutate();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Badges
        </h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Badge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Badge' : 'Add Badge'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Icon (emoji)</Label>
                  <Input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Requirement Type</Label>
                <Select
                  value={form.requirement_type}
                  onValueChange={(v) => setForm({ ...form, requirement_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {requirementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Requirement Value</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.requirement_value}
                  onChange={(e) => setForm({ ...form, requirement_value: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              <Button type="submit" className="w-full gold-gradient text-primary-foreground">
                {editingId ? 'Update' : 'Create'} Badge
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Badge</TableHead>
              <TableHead>Requirement</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="animate-pulse text-muted-foreground">Loading...</div>
                </TableCell>
              </TableRow>
            ) : badges && badges.length > 0 ? (
              badges.map((badge) => (
                <TableRow key={badge.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${badge.color}20` }}
                      >
                        {badge.icon}
                      </div>
                      <div>
                        <p className="font-medium">{badge.name}</p>
                        {badge.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{badge.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {requirementTypes.find((t) => t.value === badge.requirement_type)?.label || badge.requirement_type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{badge.requirement_value}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(badge)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteBadge.mutate(badge.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No badges found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
