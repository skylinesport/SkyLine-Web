import { useRef } from 'react';
import { motion, useScroll, useTransform, type Transition } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

// Smooth easing curve like arestov.design - using cubicBezier
const smoothTransition: Transition = {
  duration: 1.2,
  ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number],
};

export function HeroSection() {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] flex flex-col justify-center px-4 md:px-8 lg:px-16 pt-24 overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto relative z-10">
        {/* Massive Typography with clip reveal and parallax */}
        <motion.div style={{ y: textY, opacity }} className="mb-12 overflow-hidden">
          <h1 className="text-[clamp(4rem,15vw,14rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ ...smoothTransition, delay: 0 }}
              >
                LOCA
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block gold-text"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ ...smoothTransition, delay: 0.1 }}
              >
                TRACK
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.4 }}
          className="flex flex-col md:flex-row border border-border rounded-full overflow-hidden mb-16"
        >
          <Link 
            to="/auth" 
            className="flex-1 py-4 px-8 text-center font-medium hover:bg-muted/50 transition-colors duration-300 border-b md:border-b-0 md:border-r border-border"
          >
            About & Features
          </Link>
          <Link 
            to="/#leaderboard" 
            className="flex-1 py-4 px-8 text-center font-medium hover:bg-muted/50 transition-colors duration-300 border-b md:border-b-0 md:border-r border-border"
          >
            Leaderboard <span className="text-muted-foreground">(Top 10)</span>
          </Link>
          <Link 
            to={user ? "/dashboard" : "/auth"} 
            className="flex-1 py-4 px-8 text-center font-medium hover:bg-muted/50 transition-colors duration-300"
          >
            {user ? "Dashboard" : "Get Started"}
          </Link>
        </motion.div>

        {/* Tagline and Status */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Open for Achievements</span>
            </motion.div>
            
            <div className="overflow-hidden">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.7 }}
                className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
              >
                Track Your Non-Academic Wins.
                <br />
                Build Your Digital Identity.
                <br />
                <span className="text-muted-foreground">Stand Bold.</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.8 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {['Sports', 'Arts', 'Volunteering', 'Leadership'].map((tag, i) => (
                <motion.span 
                  key={tag}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 1 + i * 0.1 }}
                  className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted/50 transition-colors duration-300 cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Featured Achievement Card with Parallax */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.8 }}
          >
            <Link to={user ? "/dashboard" : "/auth?mode=signup"} className="block group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-1.5 bg-foreground text-background text-xs font-semibold rounded-full">
                    JOIN NOW
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:gold-text transition-colors duration-300">
                        Start Tracking
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Achievements / Stars
                      </p>
                    </div>
                    <div className="text-6xl font-extrabold gold-text">
                      ★
                    </div>
                  </div>
                </div>
                {/* Decorative elements with enhanced parallax */}
                <motion.div 
                  style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-20%']) }}
                  className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" 
                />
                <motion.div 
                  style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-30%']) }}
                  className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-primary/30 rounded-full blur-2xl" 
                />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
