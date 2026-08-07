import { useRef } from 'react';
import { motion, useScroll, useTransform, type Transition } from 'framer-motion';
import cardBg from '@/assets/card-bg.jpg';

// Smooth easing curve like arestov.design - using cubicBezier
const smoothTransition: Transition = {
  duration: 1.2,
  ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number],
};

export function HeroSection() {
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
    <section id="top" ref={sectionRef} className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center px-4 md:px-8 lg:px-16 pt-20 md:pt-24 overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-4 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-4 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-48 md:w-64 h-48 md:h-64 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto relative z-10">
        {/* Massive Typography with clip reveal and parallax */}
        <motion.div style={{ y: textY, opacity }} className="mb-8 md:mb-12 overflow-hidden">
          {/* Mobile: single-line wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.1 }}
            className="md:hidden text-[clamp(3rem,20vw,6rem)] font-extrabold leading-[0.9] tracking-tighter uppercase"
          >
            SKY<span className="gold-text">LINE</span>
          </motion.div>
          {/* Desktop: stacked wordmark */}
          <h1 className="hidden md:block text-[clamp(4.5rem,12vw,14rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ ...smoothTransition, delay: 0 }}
              >
                SKY
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block gold-text"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ ...smoothTransition, delay: 0.1 }}
              >
                LINE
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 md:gap-4 mb-10 md:mb-16"
        >
          <a
            href="#about"
            className="py-3 md:py-4 px-6 md:px-8 text-center text-sm md:text-base font-medium border border-border rounded-full hover:bg-muted/50 transition-colors duration-300"
          >
            About
          </a>
          <a
            href="#features"
            className="py-3 md:py-4 px-6 md:px-8 text-center text-sm md:text-base font-medium border border-border rounded-full hover:bg-muted/50 transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#download"
            className="py-3 md:py-4 px-6 md:px-8 text-center text-sm md:text-base font-medium border border-border rounded-full hover:bg-muted/50 transition-colors duration-300"
          >
            Get the App
          </a>
        </motion.div>
        {/* Tagline and Status */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-medium">Free to enter · BGMI, Free Fire, COD &amp; Fortnite</span>
            </motion.div>
            
            <div className="overflow-hidden">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.7 }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
              >
                Register for free tournaments.
                <br />
                Team up and climb the ranks.
                <br />
                <span className="text-muted-foreground">Play bold.</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.8 }}
              className="flex flex-wrap gap-2 md:gap-3 pt-2 md:pt-4"
            >
              {['BGMI', 'Free Fire', 'COD', 'Fortnite'].map((tag, i) => (
                <motion.span 
                  key={tag}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 1 + i * 0.1 }}
                  className="px-3 md:px-5 py-1.5 md:py-2 border border-border rounded-full text-xs md:text-sm font-medium hover:bg-muted/50 transition-colors duration-300 cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
          {/* Featured Achievement Card with Parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.95] as [number, number, number, number], delay: 0.8 }}
            className="hidden md:block"
          >
            <a href="#download" className="block group md:-translate-y-12">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 h-[280px] transition-transform duration-500 group-hover:scale-[1.02]">
                <img src={cardBg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-1.5 bg-foreground text-background text-xs font-semibold rounded-full">
                    JOIN NOW
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:gold-text transition-colors duration-300">
                        Enter the Arena
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Tournaments / Wins
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
