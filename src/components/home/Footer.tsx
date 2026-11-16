import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import logo from '@/assets/logo.png';

// Smooth easing curve matching the site's motion design
const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: smoothEase,
      delay,
    },
  }),
};

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/skylinesport.in' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/skylinesport/' },
  { name: 'support@skylinesport.in', href: 'mailto:support@skylinesport.in' },
];

// Absolute to the home sections so the footer works from any page (e.g. /ambassadors).
const navLinks = [
  { name: 'Home', href: '/#top' },
  { name: 'About', href: '/#about' },
  { name: 'Features', href: '/#features' },
];

export function Footer() {
  return (
    <footer id="download" className="relative bg-background border-t border-border">
      {/* Main CTA Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16">
        {/* Bottom Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {/* Navigation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={0.3}
            variants={fadeUpVariants}
          >
            <p className="font-term text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-3 md:mb-4">Navigation</p>
            <ul className="space-y-2 md:space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm md:text-base text-foreground hover:text-primary transition-colors duration-300"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={0.4}
            variants={fadeUpVariants}
          >
            <p className="font-term text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-3 md:mb-4">Connect</p>
            <ul className="space-y-2 md:space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm md:text-base text-foreground hover:text-primary transition-colors duration-300"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Logo & Copyright */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={0.5}
            variants={fadeUpVariants}
            className="col-span-2 md:col-span-1 md:text-right pt-4 md:pt-0"
          >
            <Link to="/" className="inline-block mb-3 md:mb-4">
              <img src={logo} alt="SkyLine" className="h-8 md:h-10 w-auto dark:invert" />
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Skylinesport
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              All rights reserved
            </p>
            <div className="mt-3 flex gap-4 md:justify-end text-xs md:text-sm">
              <Link to="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                Privacy
              </Link>
              <Link to="/delete-account" className="text-muted-foreground transition-colors hover:text-foreground">
                Delete account
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Large Background Text */}
      <div className="overflow-hidden border-t border-border">
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: '-50%' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex whitespace-nowrap py-4 md:py-6"
        >
          {[...Array(4)].map((_, i) => (
            <span 
              key={i} 
              className="font-display uppercase text-[clamp(2rem,8vw,8rem)] font-bold tracking-tight text-foreground/[0.07] mx-4 md:mx-8"
            >
SKYLINESPORTS • BGMI • FREE FIRE • COD • FORTNITE • TOURNAMENTS •
            </span>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
