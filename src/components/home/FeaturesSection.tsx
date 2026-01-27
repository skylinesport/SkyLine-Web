import { motion } from 'framer-motion';
import { Star, Trophy, Award, Shield, Users, Zap } from 'lucide-react';

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

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-muted-foreground text-sm font-medium">02</span>
            <span className="text-muted-foreground text-sm">/Features</span>
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tighter">
            Why<span className="gold-text">LocaTrack</span>?
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {feature.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:gold-text transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
