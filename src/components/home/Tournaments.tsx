import { motion } from 'framer-motion';
import { Trophy, Users } from 'lucide-react';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

/**
 * Representative tournament line-up. These are illustrative of what runs weekly
 * — swap in real tournaments (or wire this to the backend) before a big push.
 * Kept deliberately plausible, not inflated, so it never reads as fake proof.
 */
type Status = 'Live' | 'Filling' | 'Upcoming';
const tournaments: {
  game: string;
  title: string;
  mode: string;
  prize: string;
  filled: number;
  total: number;
  status: Status;
}[] = [
  { game: 'BGMI', title: 'Weekly Clash', mode: 'Squad', prize: '₹10,000', filled: 84, total: 100, status: 'Filling' },
  { game: 'Free Fire', title: 'Rush Hour Cup', mode: 'Duo', prize: '₹5,000', filled: 48, total: 100, status: 'Upcoming' },
  { game: 'COD Mobile', title: 'Frontline Series', mode: 'Solo', prize: '₹7,500', filled: 32, total: 64, status: 'Upcoming' },
];

const statusStyle: Record<Status, string> = {
  Live: 'bg-primary text-primary-foreground',
  Filling: 'bg-primary/15 text-primary ring-1 ring-primary/30',
  Upcoming: 'bg-muted text-muted-foreground',
};

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } },
};

export function Tournaments() {
  return (
    <section id="tournaments" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="mb-10 md:mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="flex items-baseline gap-3 md:gap-4 mb-3 md:mb-4 font-term"
            >
              <span className="text-primary text-xs md:text-sm">04</span>
              <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest">/Tournaments</span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease: smoothEase }}
                className="font-display uppercase text-[clamp(2rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight"
              >
                Play for real <span className="gold-text">prizes</span>
              </motion.h2>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
            className="max-w-xs text-sm md:text-base text-muted-foreground"
          >
            Free to enter, every week. Prize pools paid out to the top squads.
          </motion.p>
        </div>

        {/* Tournament cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:snap-none"
        >
          {tournaments.map((t) => {
            const pct = Math.round((t.filled / t.total) * 100);
            return (
              <motion.div
                key={t.title}
                variants={item}
                className="group flex w-[80%] shrink-0 snap-center flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors duration-300 hover:border-primary/40 md:w-auto"
              >
                <div className="flex items-center justify-between">
                  <span className="font-term text-xs uppercase tracking-widest text-primary">{t.game}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyle[t.status]}`}>
                    {t.status}
                  </span>
                </div>

                <h3 className="mt-4 text-xl md:text-2xl font-bold">{t.title}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{t.mode}</span>
                  <span className="text-border">·</span>
                  <span className="text-primary font-medium">Free entry</span>
                </div>

                {/* Prize */}
                <div className="mt-6 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="font-display text-3xl font-bold tracking-tight">{t.prize}</span>
                  <span className="text-xs text-muted-foreground">prize pool</span>
                </div>

                {/* Slots */}
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-term">
                    <span>{t.filled}/{t.total} slots</span>
                    <span>{pct}% full</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mt-8 md:mt-10"
        >
          <a
            href="#community"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--gold)/0.6)] transition-transform duration-300 hover:scale-[1.03]"
          >
            Get the app to join
          </a>
        </motion.div>
      </div>
    </section>
  );
}
