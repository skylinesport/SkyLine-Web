import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LOGO_URL = 'https://sxqoybifpuoiteaiotkc.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1';

// Email template styles (inline for email compatibility)
const emailStyles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    backgroundColor: '#0a0a0a',
    padding: '32px',
    textAlign: 'center' as const,
    borderRadius: '12px 12px 0 0',
  },
  logo: {
    height: '40px',
    filter: 'invert(1)',
  },
  body: {
    backgroundColor: '#ffffff',
    padding: '40px 32px',
    color: '#1a1a1a',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '16px',
    color: '#0a0a0a',
  },
  text: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4a4a4a',
    marginBottom: '16px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#B8F03C',
    color: '#1D2A05',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '16px',
    margin: '24px 0',
  },
  code: {
    display: 'inline-block',
    backgroundColor: '#f4f4f5',
    padding: '12px 24px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '24px',
    letterSpacing: '4px',
    fontWeight: 700,
    color: '#0a0a0a',
    margin: '16px 0',
  },
  footer: {
    backgroundColor: '#f9fafb',
    padding: '24px 32px',
    textAlign: 'center' as const,
    borderRadius: '0 0 12px 12px',
    borderTop: '1px solid #e5e7eb',
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  muted: {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '24px',
  },
};

// Verification Email Template
function VerificationEmail() {
  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <img src={LOGO_URL} alt="SkyLine" style={emailStyles.logo} />
      </div>
      <div style={emailStyles.body}>
        <h1 style={emailStyles.heading}>Verify your email</h1>
        <p style={emailStyles.text}>
          Welcome to SkyLine! Click the button below to verify your email address and start tracking your achievements.
        </p>
        <div style={{ textAlign: 'center' }}>
          <a href="#" style={emailStyles.button}>
            Verify Email Address
          </a>
        </div>
        <p style={emailStyles.text}>
          Or copy and paste this link into your browser:
        </p>
        <p style={{ ...emailStyles.text, wordBreak: 'break-all', color: '#1D2A05' }}>
          https://skyline.app/auth/verify?token=abc123...
        </p>
        <p style={emailStyles.muted}>
          If you didn't create an account on SkyLine, you can safely ignore this email.
        </p>
      </div>
      <div style={emailStyles.footer}>
        <p style={emailStyles.footerText}>
          © 2025 SkyLine. Track your achievements, build your identity.
        </p>
      </div>
    </div>
  );
}

// Password Reset Email Template
function PasswordResetEmail() {
  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <img src={LOGO_URL} alt="SkyLine" style={emailStyles.logo} />
      </div>
      <div style={emailStyles.body}>
        <h1 style={emailStyles.heading}>Reset your password</h1>
        <p style={emailStyles.text}>
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <div style={{ textAlign: 'center' }}>
          <a href="#" style={emailStyles.button}>
            Reset Password
          </a>
        </div>
        <p style={emailStyles.muted}>
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
      <div style={emailStyles.footer}>
        <p style={emailStyles.footerText}>
          © 2025 SkyLine. Track your achievements, build your identity.
        </p>
      </div>
    </div>
  );
}

// Magic Link Email Template
function MagicLinkEmail() {
  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <img src={LOGO_URL} alt="SkyLine" style={emailStyles.logo} />
      </div>
      <div style={emailStyles.body}>
        <h1 style={emailStyles.heading}>Sign in to SkyLine</h1>
        <p style={emailStyles.text}>
          Click the button below to sign in to your SkyLine account. No password needed!
        </p>
        <div style={{ textAlign: 'center' }}>
          <a href="#" style={emailStyles.button}>
            Sign In to SkyLine
          </a>
        </div>
        <p style={emailStyles.text}>
          Or use this one-time code:
        </p>
        <div style={{ textAlign: 'center' }}>
          <span style={emailStyles.code}>847291</span>
        </div>
        <p style={emailStyles.muted}>
          This link and code will expire in 10 minutes.
        </p>
      </div>
      <div style={emailStyles.footer}>
        <p style={emailStyles.footerText}>
          © 2025 SkyLine. Track your achievements, build your identity.
        </p>
      </div>
    </div>
  );
}

// Welcome Email Template
function WelcomeEmail() {
  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <img src={LOGO_URL} alt="SkyLine" style={emailStyles.logo} />
      </div>
      <div style={emailStyles.body}>
        <h1 style={emailStyles.heading}>Welcome to SkyLine! 🎉</h1>
        <p style={emailStyles.text}>
          Congratulations on joining SkyLine! You're now part of a community dedicated to tracking and showcasing non-academic achievements.
        </p>
        <p style={emailStyles.text}>
          <strong>Here's what you can do:</strong>
        </p>
        <ul style={{ ...emailStyles.text, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>🏆 Add achievements in Sports, Arts, Volunteering & more</li>
          <li style={{ marginBottom: '8px' }}>⭐ Earn stars (0-7) based on your accomplishments</li>
          <li style={{ marginBottom: '8px' }}>🎖️ Unlock badges as you progress</li>
          <li style={{ marginBottom: '8px' }}>🪪 Download your digital Identity Card</li>
          <li style={{ marginBottom: '8px' }}>📊 Compete on the leaderboard</li>
        </ul>
        <div style={{ textAlign: 'center' }}>
          <a href="#" style={emailStyles.button}>
            Go to Dashboard
          </a>
        </div>
      </div>
      <div style={emailStyles.footer}>
        <p style={emailStyles.footerText}>
          © 2025 SkyLine. Track your achievements, build your identity.
        </p>
      </div>
    </div>
  );
}

export default function EmailPreview() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <h1 className="font-semibold">Email Template Preview</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">SkyLine Email Templates</h1>
            <p className="text-muted-foreground">
              Preview how your branded emails will look to users
            </p>
          </div>

          <Tabs defaultValue="verification" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="verification" className="gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Verification</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="gap-2">
                <KeyRound className="w-4 h-4" />
                <span className="hidden sm:inline">Password Reset</span>
              </TabsTrigger>
              <TabsTrigger value="magic" className="gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Magic Link</span>
              </TabsTrigger>
              <TabsTrigger value="welcome" className="gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Welcome</span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-background rounded-lg shadow-lg p-8 border">
              <TabsContent value="verification">
                <VerificationEmail />
              </TabsContent>
              <TabsContent value="password">
                <PasswordResetEmail />
              </TabsContent>
              <TabsContent value="magic">
                <MagicLinkEmail />
              </TabsContent>
              <TabsContent value="welcome">
                <WelcomeEmail />
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg border text-center">
            <p className="text-sm text-muted-foreground mb-4">
              These are preview templates. To use custom branded emails, you'll need to set up Resend (free tier: 100 emails/day).
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
