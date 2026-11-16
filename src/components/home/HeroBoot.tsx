import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MovingBorderButton } from '@/components/ui/moving-border';

// Animated silk shader background (Three.js) — lazy so it never blocks paint.
const ShaderBackground = lazy(() => import('@/components/fx/ShaderBackground'));

const ease: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: d } }),
};

/**
 * Headline-led hero — the shader silk background + glowing wordmark aesthetic,
 * but the content now leads with the value proposition and a clear app CTA
 * instead of a boot-screen gimmick.
 */
export function HeroBoot() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
    >
      {/* Animated silk shader background */}
      <Suspense fallback={null}>
        <ShaderBackground />
      </Suspense>

      {/* darken toward the edges so text stays crisp over the shader */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.88)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Brand lockup — larger glowing wordmark, rule, status line */}
        <motion.div
          variants={fadeUp}
          custom={0.05}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <span className="crt-text font-display text-2xl font-bold tracking-[0.04em] md:text-4xl">
            SkyLinEsport
          </span>
          <span className="mt-3 h-px w-44 bg-gradient-to-r from-transparent via-primary/70 to-transparent md:w-60" />
          <span className="mt-3 font-term text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle animate-pulse" />
            Live · Esports
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={0.18}
          initial="hidden"
          animate="show"
          className="font-display uppercase mt-7 max-w-5xl text-[clamp(2.6rem,9vw,7rem)] font-bold leading-[0.92] tracking-tight"
        >
          Compete. Win.
          <br />
          <span className="gold-text">Climb the ranks.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={fadeUp}
          custom={0.32}
          initial="hidden"
          animate="show"
          className="mt-7 max-w-xl text-base md:text-lg text-muted-foreground"
        >
          Free <span className="text-foreground">BGMI, Free Fire, COD &amp; Fortnite</span> tournaments —
          every week. No entry fee, real prizes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          custom={0.46}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MovingBorderButton
            as="a"
            href="#community"
            borderRadius="9999px"
            duration={2800}
            containerClassName="h-14 w-auto shadow-[0_0_34px_-10px_hsl(var(--gold)/0.6)] transition-transform duration-300 hover:scale-[1.04]"
            className="gap-2.5 px-8 font-display text-sm md:text-base font-bold uppercase tracking-[0.15em]"
          >
            Get the App
            <ArrowRight className="h-4 w-4" />
          </MovingBorderButton>
        </motion.div>

        {/* meta line */}
        <motion.p
          variants={fadeUp}
          custom={0.58}
          initial="hidden"
          animate="show"
          className="mt-8 font-term text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground"
        >
          Free entry · Weekly tournaments
        </motion.p>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-term text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
      >
        ▼ Scroll
      </motion.a>
    </section>
  );
}
