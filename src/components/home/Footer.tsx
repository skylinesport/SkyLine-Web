import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-16 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold tracking-tighter">
            LOCA<span className="gold-text">TRACK</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link to="/auth?mode=signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LocaTrack. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
