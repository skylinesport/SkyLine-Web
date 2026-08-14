import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Palette, X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  profile: {
    full_name: string;
    bio?: string | null;
    theme_color?: string | null;
    about?: string | null;
    skills?: string[] | null;
    interests?: string[] | null;
  };
}

const THEME_COLORS = [
  '#B8F03C', // Lime (brand accent)
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    theme_color: profile.theme_color || '#B8F03C',
    about: profile.about || '',
    skills: profile.skills || [],
    interests: profile.interests || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          bio: form.bio || null,
          theme_color: form.theme_color,
          about: form.about || null,
          skills: form.skills.length > 0 ? form.skills : null,
          interests: form.interests.length > 0 ? form.interests : null,
        })
        .eq('id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile'] });
      setOpen(false);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const addInterest = () => {
    if (newInterest.trim() && !form.interests.includes(newInterest.trim())) {
      setForm({ ...form, interests: [...form.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setForm({ ...form, interests: form.interests.filter((i) => i !== interest) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs md:text-sm">
          <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">Profile Settings</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile.mutate();
          }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Short Bio</Label>
              <Input
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="A brief tagline about yourself"
                maxLength={100}
              />
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4" />
              Profile Theme Color
            </Label>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, theme_color: color })}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: form.theme_color === color ? 'white' : 'transparent',
                    boxShadow: form.theme_color === color ? '0 0 0 2px ' + color : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* About Section */}
          <div>
            <Label>About</Label>
            <Textarea
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              placeholder="Tell others about yourself, your journey, goals..."
              rows={4}
            />
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" size="icon" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <Label>Interests</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button type="button" size="icon" onClick={addInterest}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-accent/10 text-accent"
                >
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
