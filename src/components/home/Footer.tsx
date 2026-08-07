import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import logo from '@/assets/logo.png';

// Smooth easing curve matching the site's motion design
const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

const textRevealVariants = {
  hidden: { y: '100%' },
  visible: (delay: number) => ({
    y: 0,
    transition: {
      duration: 1,
      ease: smoothEase,
      delay,
    },
  }),
};

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
  { name: 'Instagram', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Twitter', href: '#' },
];

const navLinks = [
  { name: 'Home', href: '#top' },
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
];

export function Footer() {
  return (
    <footer id="download" className="relative bg-background border-t border-border">
      {/* Main CTA Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24 pb-12 md:pb-16">
        {/* Large CTA Text with reveal animation */}
        <div className="mb-10 md:mb-16">
          <div className="overflow-hidden">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              variants={textRevealVariants}
              className="text-muted-foreground text-xs md:text-sm lg:text-base mb-3 md:mb-4"
            >
              Free tournaments for BGMI, Free Fire, COD &amp; Fortnite.
            </motion.p>
          </div>

          <a href="#top" className="group inline-block">
            <div className="overflow-hidden">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                custom={0.1}
                variants={textRevealVariants}
                className="text-[clamp(1.75rem,6vw,6rem)] font-extrabold leading-[0.95] tracking-tighter"
              >
                <span className="inline-flex items-center gap-2 md:gap-4 group-hover:gold-text transition-colors duration-500">
                  Enter the Arena
                  <ArrowUpRight className="w-6 h-6 md:w-[clamp(1.5rem,4vw,3rem)] md:h-[clamp(1.5rem,4vw,3rem)] group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                </span>
              </motion.h2>
            </div>
          </a>
          <p className="text-muted-foreground text-sm md:text-base mt-4">
            Coming soon to the App Store &amp; Google Play.
          </p>
        </div>

        {/* Email CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          custom={0.2}
          variants={fadeUpVariants}
          className="mb-12 md:mb-20"
        >
          <a
            href="mailto:support@skylinesport.in"
            className="group inline-flex items-center gap-2 md:gap-3 text-base md:text-lg lg:text-xl text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <span className="relative">
              support@skylinesport.in
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-500" />
            </span>
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </a>
        </motion.div>
        {/* Bottom Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-border">
          {/* Navigation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={0.3}
            variants={fadeUpVariants}
          >
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">Navigation</p>
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
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">Connect</p>
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
              © {new Date().getFullYear()} Skylinesports
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              All rights reserved
            </p>
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
              className="text-[clamp(2rem,8vw,8rem)] font-extrabold tracking-tighter text-foreground/10 mx-4 md:mx-8"
            >
SKYLINESPORTS • BGMI • FREE FIRE • COD • FORTNITE • TOURNAMENTS •
            </span>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
