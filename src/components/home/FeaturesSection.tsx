import { motion } from 'framer-motion';
import { Star, Trophy, Award, Shield, Users, Zap } from 'lucide-react';

// Smooth easing curve - typed as tuple
const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

const features = [
  {
    icon: Trophy,
    title: 'Track Everything',
    description: 'Sports, dance, art, volunteering, leadership - all your non-academic wins in one place.',
    category: 'Tracking'
  },
  {
    icon: Star,
    title: 'Earn Stars',
    description: 'Dynamic 0-7 star rating system based on your verified accomplishments.',
    category: 'Rating'
  },
  {
    icon: Shield,
    title: 'Get Verified',
    description: 'Upload proof and get verified by admins. Verified achievements carry more weight.',
    category: 'Verification'
  },
  {
    icon: Award,
    title: 'Unlock Badges',
    description: 'Earn special badges for milestones and exceptional achievements.',
    category: 'Rewards'
  },
  {
    icon: Users,
    title: 'Compete & Compare',
    description: 'See how you stack up against others on the leaderboard.',
    category: 'Social'
  },
  {
    icon: Zap,
    title: 'Digital Identity',
    description: 'Build a shareable profile showcasing all your accomplishments.',
    category: 'Identity'
  }
];

// Staggered fade up for cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: smoothEase,
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto">
        {/* Section Header with reveal animation */}
        <div className="mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex items-baseline gap-3 md:gap-4 mb-3 md:mb-4"
          >
            <span className="text-muted-foreground text-xs md:text-sm font-medium">03</span>
            <span className="text-muted-foreground text-xs md:text-sm">/Features</span>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: smoothEase }}
              className="text-[clamp(2rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tighter"
            >
              Why<span className="gold-text">SkyLine</span>?
            </motion.h2>
          </div>
        </div>

        {/* Features Grid with staggered animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group p-5 md:p-8 rounded-xl md:rounded-2xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {feature.category}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:gold-text transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
