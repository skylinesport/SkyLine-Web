import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Matches the site's easing curve (see HeroSection / Footer).
const ease = [0.6, 0.01, 0.05, 0.95] as [number, number, number, number];

// The canonical Play Store URL for the app. It 404s until the listing is live,
// then resolves automatically — no change needed at launch.
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=in.skylinesport.app';

// App Store link — placeholder until iOS ships. Point this at the backend
// redirect (or the real App Store URL) later. '#' keeps the badge inert for now.
const APP_STORE_URL = '#';

// Player reviews shown in the scrolling marquee below. Placeholder content for
// now — swap in real player reviews (and photos) before/at launch.
const REVIEWS: { name: string; game: string; initials: string; quote: string }[] = [
  { name: 'Arjun R.', game: 'BGMI', initials: 'AR', quote: 'Free tournaments that actually pay out. Registered in seconds.' },
  { name: 'Neha S.', game: 'Free Fire', initials: 'NS', quote: 'Found a squad and climbed the ranks in a week.' },
  { name: 'Kabir M.', game: 'BGMI', initials: 'KM', quote: 'No entry fee, real prizes. The leaderboard keeps me grinding.' },
  { name: 'Priya T.', game: 'Free Fire', initials: 'PT', quote: 'Team-up invites make finding teammates so easy.' },
  { name: 'Rohit V.', game: 'BGMI', initials: 'RV', quote: 'Clean UI and weekly matches — exactly what I wanted.' },
  { name: 'Sana K.', game: 'Free Fire', initials: 'SK', quote: 'Won my first reward last week. Hooked already.' },
];

// Rating + Downloads. NOTE: placeholder values — there are no real ratings or
// downloads until the app is live. Set real numbers before this goes public.
const STATS: { value?: string; label: string; stars?: boolean }[] = [
  { label: 'Play Store Rating', stars: true }, // TODO: real rating at launch
  { value: '1,000+', label: 'Downloads' },     // TODO: real count at launch
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

// Apple logo (App Store badge glyph).
const AppleGlyph = (
  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 8.41 7.35c1.44.07 2.44.77 3.28.85 1.26-.26 2.47-.99 3.82-.89 1.62.13 2.84.77 3.64 1.94-3.34 2.06-2.56 6.4.48 7.61-.61 1.6-1.4 3.19-2.58 4.43M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
  </svg>
);

// Google Play four-colour triangle (Google Play badge glyph).
const PlayGlyph = (
  <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
    <path fill="#00c3ff" d="M3.6 2.4a1.5 1.5 0 0 0-.42 1.05v17.1c0 .42.15.78.42 1.05l.06.06L13.2 12.06v-.12L3.66 2.34z" />
    <path fill="#ffce00" d="m16.38 15.24-3.18-3.18v-.12l3.18-3.18.072.042 3.768 2.142c1.08.612 1.08 1.614 0 2.226l-3.768 2.142z" />
    <path fill="#ff3a44" d="M16.452 15.126 13.2 11.94 3.6 21.54c.36.378.942.42 1.608.048l11.244-6.462" />
    <path fill="#00f076" d="M16.452 8.874 5.208 2.412C4.542 2.028 3.96 2.082 3.6 2.46l9.6 9.48z" />
  </svg>
);

function StoreBadge({
  href,
  glyph,
  line1,
  line2,
  disabled = false,
}: {
  href: string;
  glyph: React.ReactNode;
  line1: string;
  line2: string;
  disabled?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={disabled}
      className={`inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black px-5 py-2.5 text-white transition-transform duration-300 hover:scale-[1.03] ${
        disabled ? 'pointer-events-none opacity-60' : ''
      }`}
    >
      {glyph}
      <span className="text-left leading-none">
        <span className="block text-[10px] font-medium tracking-wide opacity-80">{line1}</span>
        <span className="mt-0.5 block text-lg font-semibold">{line2}</span>
      </span>
    </a>
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

          {/* Store badges — App Store (placeholder) + Google Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <StoreBadge
              href={APP_STORE_URL}
              glyph={AppleGlyph}
              line1="Download on the"
              line2="App Store"
              disabled
            />
            <StoreBadge href={PLAY_STORE_URL} glyph={PlayGlyph} line1="GET IT ON" line2="Google Play" />
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="mx-auto mt-16 grid w-full max-w-md grid-cols-2 gap-8 border-t border-border pt-10"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                {s.stars ? (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                ) : (
                  <span className="text-3xl font-extrabold tracking-tight md:text-4xl">{s.value}</span>
                )}
                <span className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Moving reviews marquee — full-bleed, continuous horizontal scroll */}
      <div className="relative z-10 mt-20 -mx-4 overflow-hidden md:-mx-8 lg:-mx-16">
        <motion.div
          className="flex w-max"
          initial={{ x: '0%' }}
          animate={{ x: '-50%' }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <div
              key={i}
              className="mr-4 flex w-[300px] shrink-0 items-center gap-3 rounded-2xl border border-border bg-card/50 px-5 py-4"
            >
              <Avatar initials={r.initials} className="h-11 w-11 shrink-0 text-sm" />
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">· {r.game}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                  "{r.quote}"
                </p>
              </div>
            </div>
          ))}
        </motion.div>
        {/* Soft edge fades so cards ease in/out instead of hard-cutting */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-28" />
      </div>
    </section>
  );
}
