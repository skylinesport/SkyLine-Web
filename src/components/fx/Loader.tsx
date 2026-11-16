import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Boot/intro loader — a brief "system boot" sequence that counts to 100 and
 * then lifts away to reveal the hero. Shown once per browser session so it
 * doesn't nag on internal navigation. Reduced-motion visitors skip straight in.
 */
export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let skip = reduced;
    try {
      if (sessionStorage.getItem('sky_booted')) skip = true;
    } catch {
      /* private mode — just show it */
    }
    if (skip) {
      setDone(true);
      return;
    }

    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 11 + 5);
      setProgress(Math.floor(p));
      if (p >= 100) {
        clearInterval(id);
        try {
          sessionStorage.setItem('sky_booted', '1');
        } catch {
          /* ignore */
        }
        setTimeout(() => setDone(true), 450);
      }
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <div className="crt-text font-display text-base tracking-[0.12em]">SkyLinEsport</div>

          <div className="mt-8 w-64 max-w-[72vw]">
            <div className="mb-2 flex justify-between font-term text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>System boot</span>
              <span className="tabular-nums text-primary">{String(progress).padStart(3, '0')}%</span>
            </div>
            <div className="h-px w-full overflow-hidden bg-border">
              <div className="h-full bg-primary transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
