import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
          {/* Left - Tagline (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.2 }}
            className="hidden md:block text-sm text-muted-foreground font-medium"
          >
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}, Free Esports Tournaments
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 -ml-2 text-foreground"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center - Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Link to="/" onClick={closeMenu}>
              <img src={logo} alt="Skylinesport" className="h-7 md:h-8 w-auto dark:invert" />
            </Link>
          </motion.div>

          {/* Right - Menu (Desktop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.3 }}
            className="hidden md:flex items-center gap-2"
          >
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2">
              Features
            </a>
            <ThemeToggle />
            <a href="#download">
              <Button variant="ghost" size="sm" className="font-medium">
                Get the App
              </Button>
            </a>
          </motion.div>

          {/* Right - Mobile Icons */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-background border-r border-border md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <Link to="/" onClick={closeMenu}>
                    <img src={logo} alt="Skylinesport" className="h-7 w-auto dark:invert" />
                  </Link>
                  <button onClick={closeMenu} className="p-2 text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1">
                  <a
                    href="#top"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="#about"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    About
                  </a>
                  <a
                    href="#features"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    Features
                  </a>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border space-y-3">
                  <a href="#download" onClick={closeMenu} className="block">
                    <Button className="w-full" size="lg">
                      Get the App
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
