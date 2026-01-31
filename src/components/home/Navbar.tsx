import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserSearch } from '@/components/UserSearch';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

export function Navbar() {
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: smoothEase }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        {/* Left - Time/Location Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.2 }}
          className="text-sm text-muted-foreground font-medium"
        >
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}, Track Achievements
        </motion.div>

        {/* Center - Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Link to="/">
            <img src={logo} alt="SkyLine" className="h-8 w-auto dark:invert" />
          </Link>
        </motion.div>

        {/* Right - Menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <UserSearch />
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
        </motion.div>
      </div>
    </motion.nav>
  );
}
