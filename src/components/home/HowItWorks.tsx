import { motion } from 'framer-motion';
import { UserPlus, Gamepad2, Users, Radio } from 'lucide-react';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

const steps = [
  {
    icon: UserPlus,
    title: 'Register free',
    description: 'Create your account in seconds. No entry fee, no catch — ever.',
  },
  {
    icon: Gamepad2,
    title: 'Join a tournament',
    description: 'Browse free BGMI, Free Fire, COD & Fortnite matches and lock your slot.',
  },
  {
    icon: Users,
    title: 'Team up',
    description: 'Invite players to your squad and head in together — solo, duo or squad.',
  },
  {
    icon: Radio,
    title: 'Get your room & drop',
    description: 'Room ID & password land in-app and by SMS, 5 minutes before you drop in.',
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } },
};

export function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex items-baseline gap-3 md:gap-4 mb-3 md:mb-4 font-term"
          >
            <span className="text-primary text-xs md:text-sm">02</span>
            <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest">/How it works</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: smoothEase }}
              className="font-display uppercase text-[clamp(2rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight"
            >
              From sign-up to <span className="gold-text">drop</span>
            </motion.h2>
          </div>
        </div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:snap-none"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={item}
                className="group relative w-[76%] shrink-0 snap-center rounded-2xl border border-border bg-card/40 p-6 transition-colors duration-300 hover:border-primary/40 md:w-auto md:p-7"
              >
                {/* Step number — big, monospace, faint until hover */}
                <span className="pointer-events-none absolute right-5 top-4 font-term text-4xl md:text-5xl font-bold text-foreground/5 transition-colors duration-300 group-hover:text-primary/20">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-5 text-lg md:text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
