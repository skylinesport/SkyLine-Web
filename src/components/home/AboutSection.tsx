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
            className="flex items-baseline gap-3 md:gap-4 mb-3 md:mb-4"
          >
            <span className="text-muted-foreground text-xs md:text-sm font-medium">01</span>
            <span className="text-muted-foreground text-xs md:text-sm">/About</span>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: smoothEase }}
              className="text-[clamp(2rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tighter"
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
            className="space-y-6 md:space-y-8 md:-mt-[150px]"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-muted/20">
                <div className="text-2xl md:text-4xl font-extrabold gold-text mb-1 md:mb-2">Free</div>
                <div className="text-xs md:text-sm text-muted-foreground">Entry to every tournament</div>
              </div>
              <div className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-muted/20">
                <div className="text-2xl md:text-4xl font-extrabold gold-text mb-1 md:mb-2">4+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Games — BGMI, Free Fire, COD, Fortnite</div>
              </div>
            </div>

            <div className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-muted/20">
              <h3 className="font-semibold text-base md:text-lg mb-3">How It Works</h3>
              <ol className="space-y-2 md:space-y-3 text-muted-foreground text-sm md:text-base">
                <li className="flex gap-2 md:gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Sign up with your phone number</span>
                </li>
                <li className="flex gap-2 md:gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Find a free tournament and register</span>
                </li>
                <li className="flex gap-2 md:gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Team up with players or go solo</span>
                </li>
                <li className="flex gap-2 md:gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Play, win, and climb the ranks</span>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
