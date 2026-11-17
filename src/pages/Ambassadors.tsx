import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate, useInView } from 'framer-motion';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { VanishInput } from '@/components/ui/vanish-input';
import { IndiaMap } from '@/components/ui/india-map';
import { Footer } from '@/components/home/Footer';

const ease: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];
const CAMPUS_EMAIL = 'support@skylinesport.in';

// Headline numbers under the map. ⚠️ PLACEHOLDERS — replace `value` with the
// real figures before this goes live (don't ship invented stats).
const STATS: { value: number; suffix?: string; prefix?: string; label: string }[] = [
  { value: 25, suffix: '+', label: 'Campuses live' },
  { value: 1000, suffix: '+', label: 'Players reached' },
  { value: 50, prefix: '₹', suffix: 'K+', label: 'Prizes awarded' },
];

/** A single count-up stat that animates when scrolled into view. */
function Stat({ value, suffix, prefix, label }: (typeof STATS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <div ref={ref}>
      <p className="font-display text-2xl font-bold text-primary md:text-3xl">
        {prefix}
        {n.toLocaleString('en-IN')}
        {suffix}
      </p>
      <p className="mt-1 font-term text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">{label}</p>
    </div>
  );
}

/**
 * Campus ambassadors showcase + application page.
 *
 * The two marquee rows below are PLACEHOLDERS — replace ROW_ONE / ROW_TWO with
 * real ambassadors (each takes name, college, and an optional `photo` you
 * import). Until a photo is set, a large initials tile is shown. Ten per row,
 * the rows auto-scroll in opposite directions.
 */
type Ambassador = { name: string; college: string; photo?: string; initials?: string };

const mk = (initials: string): Ambassador => ({ name: 'Ambassador', college: 'Your college', initials });
const ROW_ONE: Ambassador[] = ['AR', 'PK', 'SM', 'AV', 'RJ', 'DK', 'NS', 'PT', 'AM', 'SG'].map(mk);
const ROW_TWO: Ambassador[] = ['VK', 'RD', 'MH', 'KP', 'TS', 'BN', 'JD', 'LC', 'OP', 'HR'].map(mk);

function ProfileCard({ a }: { a: Ambassador }) {
  const initials =
    a.initials ??
    a.name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  return (
    <div className="relative w-44 shrink-0 overflow-hidden rounded-2xl border border-border md:w-56">
      {a.photo ? (
        <img src={a.photo} alt={a.name} className="aspect-square w-full object-cover" />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-primary/25 via-card to-accent/10">
          <span className="font-display text-5xl font-bold text-foreground/25">{initials}</span>
        </div>
      )}
      {/* info pinned to the bottom of the frame, over a fade */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/85 to-transparent p-4 pt-12">
        <p className="font-display text-sm font-bold leading-tight">{a.name}</p>
        <p className="mt-1 flex items-center gap-1 font-term text-[10px] uppercase tracking-wider text-primary">
          <GraduationCap className="h-3 w-3 shrink-0" />
          {a.college}
        </p>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse }: { items: Ambassador[]; reverse?: boolean }) {
  return (
    <motion.div
      className="flex w-max gap-4"
      animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
      transition={{ duration: 55, ease: 'linear', repeat: Infinity }}
    >
      {[...items, ...items].map((a, i) => (
        <ProfileCard key={i} a={a} />
      ))}
    </motion.div>
  );
}

export default function Ambassadors() {
  const [form, setForm] = useState({ name: '', email: '', college: '' });
  const [vanishSignal, setVanishSignal] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.college.trim()) {
      toast.error('Please fill in your name, email and college.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    const subject = encodeURIComponent('Campus Ambassador Application');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCollege: ${form.college}\n\nI'd like to become a SkyLinEsport campus ambassador.`,
    );
    // Trigger the vanish animation, then open the email a beat later.
    setVanishSignal((s) => s + 1);
    toast.success('Opening your email to send the application…');
    setTimeout(() => {
      window.location.href = `mailto:${CAMPUS_EMAIL}?subject=${subject}&body=${body}`;
    }, 900);
  };

  return (
    <div className="hero-scanlines relative min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:px-16">
          <Link to="/" className="flex items-center gap-2 font-term text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src={logo} alt="SkyLinEsport" className="h-7 w-auto dark:invert" />
          </Link>
          <span className="w-12" aria-hidden="true" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-10 pt-20 text-center md:px-8 md:pb-14 md:pt-28 lg:px-16">
        {/* soft glow behind the interactive ripple grid */}
        <div
          className="pointer-events-none absolute left-1/2 top-24 h-72 w-[560px] max-w-[90vw] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
          aria-hidden="true"
        />
        {/* interactive ripple grid — click the cells */}
        <BackgroundRippleEffect rows={9} />

        <div className="pointer-events-none container relative z-10 mx-auto flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-term text-xs uppercase tracking-[0.3em] text-primary"
          >
            // Campus program
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="font-display uppercase mt-4 max-w-4xl text-[clamp(2.4rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight"
          >
            Campus <span className="gold-text">ambassadors</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            The students bringing SkyLinEsport to their campuses — running tournaments, building
            communities, and leading the grind.
          </motion.p>
        </div>
      </section>

      {/* Showcase — two opposite-scrolling rows */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto mb-8 flex items-baseline gap-3 px-4 font-term md:mb-10 md:px-8 lg:px-16">
          <span className="text-primary text-xs md:text-sm">01</span>
          <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest">/Meet the team</span>
        </div>

        <div className="relative space-y-4 overflow-hidden">
          <MarqueeRow items={ROW_ONE} />
          <MarqueeRow items={ROW_TWO} reverse />
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-28" />
        </div>
      </section>

      {/* Apply — form on the left, map + pitch on the right */}
      <section id="apply" className="px-4 py-12 md:px-8 md:py-20 lg:px-16">
        <div className="container mx-auto">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Right — the application form */}
            <form
              onSubmit={handleSubmit}
              className="order-2 space-y-5 rounded-2xl border border-border bg-card/40 p-6 md:p-8"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="font-term text-xs uppercase tracking-widest text-muted-foreground">Name</Label>
                <VanishInput
                  id="name"
                  placeholders={['Your full name', 'What should we call you?', 'e.g. your gamertag + name']}
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  vanishSignal={vanishSignal}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-term text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
                <VanishInput
                  id="email"
                  type="email"
                  placeholders={['you@example.com', 'Your college email', 'Where can we reach you?']}
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  vanishSignal={vanishSignal}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college" className="font-term text-xs uppercase tracking-widest text-muted-foreground">College</Label>
                <VanishInput
                  id="college"
                  placeholders={['Your college / university', 'Where do you study?', 'e.g. your campus name']}
                  value={form.college}
                  onChange={(v) => setForm((f) => ({ ...f, college: v }))}
                  vanishSignal={vanishSignal}
                />
              </div>
              <Button type="submit" className="w-full font-display uppercase tracking-[0.15em]" size="lg">
                Submit application
              </Button>
              <p className="text-center font-term text-[11px] uppercase tracking-wider text-muted-foreground">
                Or email us at{' '}
                <a href={`mailto:${CAMPUS_EMAIL}`} className="text-primary hover:underline">
                  {CAMPUS_EMAIL}
                </a>
              </p>
            </form>

            {/* Left — pitch + animated India map */}
            <div className="order-1">
              <div className="mb-6 flex items-baseline gap-3 font-term">
                <span className="text-primary text-xs md:text-sm">02</span>
                <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest">/Apply</span>
              </div>

              <h2 className="font-display uppercase whitespace-nowrap text-[clamp(1.4rem,5.1vw,2.75rem)] font-bold leading-[0.95] tracking-tight">
                Become an <span className="gold-text">ambassador</span>
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Lead the gaming community at your college. Run tournaments, grow your network, and get
                rewarded. Drop your details and we&apos;ll reach out.
              </p>

              <div className="mt-8">
                <IndiaMap />
              </div>

              {/* Headline numbers */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
                {STATS.map((s) => (
                  <Stat key={s.label} {...s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
