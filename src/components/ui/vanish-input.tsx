import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Controlled "vanish" input (adapted from Aceternity UI's Placeholders & Vanish
 * Input). Cycles through animated placeholders, and when `vanishSignal` changes
 * the typed text disintegrates into particles. Unlike the original it owns no
 * form/submit button, so several can live inside one real form — the parent
 * bumps `vanishSignal` on submit to vanish them all at once. Dark-themed.
 */
type Particle = { x: number; y: number; r: number; color: string };

export function VanishInput({
  id,
  type = 'text',
  placeholders,
  value,
  onChange,
  vanishSignal,
}: {
  id?: string;
  type?: string;
  placeholders: string[];
  value: string;
  onChange: (v: string) => void;
  vanishSignal: number;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const start = () => {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((p) => (p + 1) % placeholders.length);
      }, 3000);
    };
    const onVis = () => {
      if (document.visibilityState !== 'visible' && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (document.visibilityState === 'visible') {
        start();
      }
    };
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [placeholders]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<Particle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const cs = getComputedStyle(inputRef.current);
    const fontSize = parseFloat(cs.getPropertyValue('font-size'));
    ctx.font = `${fontSize * 2}px ${cs.fontFamily}`;
    ctx.fillStyle = '#FFF';
    ctx.fillText(value, 16, 40);

    const pixels = ctx.getImageData(0, 0, 800, 800).data;
    const next: { x: number; y: number; color: number[] }[] = [];
    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n;
        if (pixels[e] !== 0 && pixels[e + 1] !== 0 && pixels[e + 2] !== 0) {
          next.push({ x: n, y: t, color: [pixels[e], pixels[e + 1], pixels[e + 2], pixels[e + 3]] });
        }
      }
    }
    dataRef.current = next.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const frame = (pos = 0) => {
      requestAnimationFrame(() => {
        const arr: Particle[] = [];
        for (let i = 0; i < dataRef.current.length; i++) {
          const c = dataRef.current[i];
          if (c.x < pos) {
            arr.push(c);
          } else {
            if (c.r <= 0) {
              c.r = 0;
              continue;
            }
            c.x += Math.random() > 0.5 ? 1 : -1;
            c.y += Math.random() > 0.5 ? 1 : -1;
            c.r -= 0.05 * Math.random();
            arr.push(c);
          }
        }
        dataRef.current = arr;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          dataRef.current.forEach((t) => {
            if (t.x > pos) {
              ctx.beginPath();
              ctx.rect(t.x, t.y, t.r, t.r);
              ctx.fillStyle = t.color;
              ctx.strokeStyle = t.color;
              ctx.stroke();
            }
          });
        }
        if (dataRef.current.length > 0) {
          frame(pos - 8);
        } else {
          setAnimating(false);
        }
      });
    };
    frame(start);
  };

  // Vanish when the parent bumps the signal (skip the initial mount value).
  const seen = useRef(vanishSignal);
  useEffect(() => {
    if (vanishSignal === seen.current) return;
    seen.current = vanishSignal;
    if (!value) return;
    setAnimating(true);
    draw();
    const maxX = dataRef.current.reduce((p, c) => (c.x > p ? c.x : p), 0);
    animate(maxX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vanishSignal]);

  return (
    <div className="relative h-11 w-full overflow-hidden rounded-xl border border-border bg-card/60 transition-colors focus-within:border-primary/50">
      <canvas
        className={cn(
          'pointer-events-none absolute left-2 top-[20%] origin-top-left scale-50 pr-20',
          animating ? 'opacity-100' : 'opacity-0',
        )}
        ref={canvasRef}
      />
      <input
        id={id}
        type={type}
        ref={inputRef}
        value={value}
        onChange={(e) => {
          if (!animating) onChange(e.target.value);
        }}
        className={cn(
          'relative z-10 h-full w-full border-none bg-transparent px-4 text-sm text-foreground focus:outline-none focus:ring-0',
          animating && 'text-transparent',
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              key={currentPlaceholder}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'linear' }}
              className="w-[calc(100%-1rem)] truncate pl-4 text-left text-sm text-muted-foreground"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
