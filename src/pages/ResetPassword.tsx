import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { z } from 'zod';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// The reset token + confirm endpoint live on the app's (NestJS) API, not
// Supabase — this page is the landing for the password-reset email the app
// sends. Override with VITE_API_URL; falls back to the live backend so the
// reset flow works even if the env var isn't set in the deployment.
const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? 'https://api.skylinesport.in').replace(/\/$/, '');

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/password/reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'This reset link is invalid or has expired.');
      }
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Missing/blank token → the link is malformed ──
  if (!token) {
    return (
      <Shell>
        <StatusCard
          icon={<AlertTriangle className="w-8 h-8 text-destructive" />}
          title="Invalid reset link"
          body="This link is missing its reset token. Request a new password reset from the app and open the newest email."
        />
      </Shell>
    );
  }

  // ── Success ──
  if (done) {
    return (
      <Shell>
        <StatusCard
          icon={<CheckCircle2 className="w-8 h-8 text-primary" />}
          title="Password updated"
          body="Your password has been changed. Head back to the Skylinesport app and sign in with your new password."
        />
      </Shell>
    );
  }

  // ── Form ──
  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-2">Set a new password</h1>
      <p className="text-muted-foreground mb-6">Choose a new password for your Skylinesport account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
        </div>

        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirm"
              type={show ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pl-10"
              autoComplete="new-password"
            />
          </div>
          {errors.confirm && <p className="text-sm text-destructive mt-1">{errors.confirm}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <div className="glass-card-elevated p-8">
          <div className="mb-6">
            <img src={logo} alt="Skylinesport" className="h-10 w-auto dark:invert" />
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function StatusCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">{icon}</div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{body}</p>
    </motion.div>
  );
}
