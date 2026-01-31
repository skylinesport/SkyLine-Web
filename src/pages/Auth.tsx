import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/logo.png';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp, isAdmin } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // Redirect admins to admin panel, regular users to dashboard
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (isForgotPassword) {
        if (!formData.email) {
          setErrors({ email: 'Email is required' });
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password reset email sent! Check your inbox.');
          setIsForgotPassword(false);
        }
      } else if (isSignUp) {
        const result = signUpSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in.');
          } else {
            toast.error(error.message);
          }
        } else {
          setSentEmail(formData.email);
          setEmailSent(true);
        }
      } else {
        const result = signInSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error('Invalid email or password');
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="glass-card-elevated p-8">
          <div className="mb-6">
            <img src={logo} alt="SkyLine" className="h-10 w-auto dark:invert" />
          </div>

          {emailSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Check your email</h1>
              <p className="text-muted-foreground mb-4">
                We've sent a verification link to<br />
                <span className="font-medium text-foreground">{sentEmail}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Click the link in your email to verify your account and start tracking achievements.
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmailSent(false);
                    setIsSignUp(false);
                    setFormData({ email: '', password: '', fullName: '' });
                  }}
                >
                  Back to Sign In
                </Button>
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setEmailSent(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">
                {isForgotPassword ? 'Reset your password' : isSignUp ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isForgotPassword ? 'Enter your email to receive a reset link' : isSignUp ? 'Start tracking your achievements' : 'Sign in to your account'}
              </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && !isForgotPassword && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10"
                  />
                </div>
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            {!isForgotPassword && (
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-primary hover:underline mt-2 block"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground font-semibold h-11"
            >
              {loading ? 'Loading...' : isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-primary hover:underline font-medium"
              >
                Back to sign in
              </button>
            ) : (
              <>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </>
            )}
          </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
