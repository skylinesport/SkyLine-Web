import { motion } from 'framer-motion';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex items-baseline gap-3 md:gap-4 mb-3 md:mb-4 font-term"
          >
            <span className="text-primary text-xs md:text-sm">01</span>
            <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest">/About</span>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: smoothEase }}
              className="font-display uppercase text-[clamp(2rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight"
            >
Built for <span className="gold-text">Gamers</span>
            </motion.h2>
          </div>
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="space-y-4 md:space-y-6"
          >
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground">
              Skylinesport is where players register for <span className="gold-text font-semibold">free BGMI, Free Fire, COD &amp; Fortnite tournaments</span>,
              team up, and compete.
            </p>
            <p className="hidden md:block text-muted-foreground text-base md:text-lg leading-relaxed">
              Find tournaments, invite players to your squad, build a profile that shows your stats,
              wins and badges — and get your match room details in-app and by SMS, right before you drop in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-muted/20">
                <div className="font-display text-2xl md:text-4xl font-bold gold-text mb-1 md:mb-2">Free</div>
                <div className="text-xs md:text-sm text-muted-foreground">Entry to every tournament</div>
              </div>
              <div className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-muted/20">
                <div className="font-display text-2xl md:text-4xl font-bold gold-text mb-1 md:mb-2">4+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Games — BGMI, Free Fire, COD, Fortnite</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
