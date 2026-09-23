import { motion } from 'framer-motion';
import { Star, Play } from 'lucide-react';

// Matches the site's easing curve (see HeroSection / Footer).
const ease = [0.6, 0.01, 0.05, 0.95] as [number, number, number, number];

// The canonical Play Store URL for the app. It 404s until the listing is live,
// then resolves automatically — no change needed at launch.
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=in.skylinesport.app';

// Decorative floating avatars (initials-based — no external images, matches the
// app's own initials avatars). Desktop only; hidden on mobile.
const FACES = [
  { initials: 'AR', pos: 'top-4 left-[7%]', size: 'h-16 w-16 text-lg', delay: 0.1 },
  { initials: 'NS', pos: 'top-20 right-[9%]', size: 'h-20 w-20 text-xl', delay: 0.2 },
  { initials: 'KM', pos: 'bottom-8 left-[13%]', size: 'h-14 w-14 text-base', delay: 0.3 },
  { initials: 'PT', pos: 'bottom-16 right-[15%]', size: 'h-16 w-16 text-lg', delay: 0.4 },
];

// Real player reviews go here — the cards below render automatically once this
// has entries. Empty until we have genuine reviews (no fabricated testimonials).
// Shape: { name: 'Arjun R.', game: 'BGMI', initials: 'AR', quote: '…' }
const REVIEWS: { name: string; game: string; initials: string; quote: string }[] = [];

// Honest, concrete facts only — no ratings/counts until they're real.
const STATS = [
  { value: 'Free', label: 'To Enter' },
  { value: 'Weekly', label: 'Tournaments' },
  { value: '4', label: 'Games' },
];

function Avatar({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/40 to-accent/30 font-bold text-foreground ${className}`}
    >
      {initials}
    </div>
  );
}

export function CommunitySection() {
  return (
    <section
      id="community"
      className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32 lg:px-16"
    >
      {/* Ambient blobs, same treatment as the hero */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto">
        {/* Floating avatars — decorative, desktop only */}
        {FACES.map((f) => (
          <motion.div
            key={f.initials}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease, delay: f.delay }}
            className={`absolute z-0 hidden md:flex ${f.pos}`}
          >
            <Avatar initials={f.initials} className={`${f.size} shadow-xl shadow-primary/10`} />
          </motion.div>
        ))}

        {/* Centered hero content */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Social-proof pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease }}
            className="mb-8 flex items-center gap-3 rounded-full border border-border bg-muted/30 py-2 pl-2 pr-5"
          >
            <div className="flex -space-x-2">
              {['AR', 'NS', 'KM'].map((i) => (
                <Avatar key={i} initials={i} className="h-7 w-7 text-[10px] ring-2 ring-background" />
              ))}
            </div>
            <span className="text-sm font-medium">Be one of the first players</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tighter"
          >
            Join the players
            <br />
            competing <span className="gold-text">every week</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
          >
            Free esports tournaments every week — BGMI, Free Fire and more. No entry fee, no catch.
          </motion.p>

          {/* Google Play CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="mt-10"
          >
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-2xl bg-foreground px-6 py-3.5 text-background transition-transform duration-300 hover:scale-[1.03]"
            >
              <Play className="h-6 w-6 fill-background" />
              <span className="text-left leading-none">
                <span className="block text-[10px] font-medium uppercase tracking-wide opacity-70">
                  Get it on
                </span>
                <span className="block text-lg font-bold">Google Play</span>
              </span>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="mt-16 grid w-full grid-cols-3 gap-8 border-t border-border pt-10"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-3xl font-extrabold tracking-tight md:text-4xl">{s.value}</span>
                <span className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Review cards — render only once there are real reviews */}
        {REVIEWS.length > 0 && (
        <div className="relative z-10 mt-20 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease, delay: 0.1 * i }}
              className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">"{r.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar initials={r.initials} className="h-10 w-10 text-sm" />
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.game}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
