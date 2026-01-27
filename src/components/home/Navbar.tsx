import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        {/* Left - Time/Location Style */}
        <div className="text-sm text-muted-foreground font-medium">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}, Track Achievements
        </div>

        {/* Center - Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-bold text-sm tracking-wider">
          LCTRK®
        </Link>

        {/* Right - Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="font-medium">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="font-medium">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
