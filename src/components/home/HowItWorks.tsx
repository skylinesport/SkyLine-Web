import { motion } from 'framer-motion';
import { UserPlus, Gamepad2, Users, Radio } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

const steps: { icon: LucideIcon; title: string; description: string }[] = [
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
  visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } },
};

function Node({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background text-primary shadow-[0_0_24px_-8px_hsl(var(--gold)/0.6)]">
      <Icon className="h-5 w-5" />
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="mb-12 md:mb-20">
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

        {/* Desktop — horizontal connected path */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative hidden md:block"
        >
          {/* connecting line through the node centres */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 h-px bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
          <div className="grid grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.title} variants={item} className="flex flex-col items-center text-center">
                <Node Icon={s.icon} />
                <span className="mt-5 font-term text-[11px] uppercase tracking-widest text-primary">
                  Step {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1.5 font-display text-lg font-bold uppercase tracking-tight lg:text-xl">{s.title}</h3>
                <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile — vertical timeline */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative md:hidden"
        >
          <div className="pointer-events-none absolute bottom-6 left-7 top-6 w-px bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10" />
          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div key={s.title} variants={item} className="flex gap-5">
                <Node Icon={s.icon} />
                <div className="pt-1">
                  <span className="font-term text-[11px] uppercase tracking-widest text-primary">
                    Step {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-tight">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
