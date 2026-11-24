import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import { AMBASSADORS_ENABLED } from '@/lib/features';
import { cn } from '@/lib/utils';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 60));

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Resizable nav: full-width bar at the top, shrinks into a floating pill on scroll */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center"
      >
        <motion.div
          initial={false}
          animate={{ maxWidth: scrolled ? 940 : 1536, marginTop: scrolled ? 12 : 0, borderRadius: scrolled ? 9999 : 0 }}
          transition={{ duration: 0.35, ease: smoothEase }}
          className={cn(
            'relative flex h-14 w-full items-center justify-between px-4 backdrop-blur-xl transition-colors duration-300 md:px-8',
            scrolled
              ? 'border border-border bg-background/85 shadow-lg shadow-black/30'
              : 'border-b border-border/50 bg-background/60',
          )}
        >
          {/* Left — logo (+ tagline on desktop) */}
          <div className="flex items-center gap-3">
            <Link to="/" onClick={closeMenu}>
              <img src={logo} alt="SkyLinEsport" className="h-7 md:h-8 w-auto dark:invert" />
            </Link>
            <span className="hidden md:block font-term text-xs uppercase tracking-widest text-muted-foreground">
              Free Esports Tournaments
            </span>
          </div>

          {/* Right — Ambassadors (desktop) / menu button (mobile) */}
          <div className="flex items-center">
            {AMBASSADORS_ENABLED && (
              <Link
                to="/ambassadors"
                className="hidden md:inline font-term text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-2"
              >
                Ambassadors
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="md:hidden -mr-2 p-2 text-foreground"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </motion.div>
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
                  {AMBASSADORS_ENABLED && (
                    <Link
                      to="/ambassadors"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
                    >
                      Ambassadors
                    </Link>
                  )}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border space-y-3">
                  <a href="#community" onClick={closeMenu} className="block">
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
