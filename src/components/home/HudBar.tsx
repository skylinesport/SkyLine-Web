import { useEffect, useState } from 'react';

/**
 * Persistent game-HUD strip pinned to the bottom of the viewport — the kind of
 * status bar a game overlays on screen (Wonder Makers uses the same trick).
 * It's pure chrome: a live "servers online" pulse, the game line, a running
 * clock and a playful FPS read-out, all in monospace so it reads as an
 * interface rather than marketing copy. The lime dot + FPS are the one spot of
 * brand colour down here.
 */
export function HudBar() {
  const [time, setTime] = useState('');
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
      // Idle FPS flicker between 58–60 — cosmetic, just to feel "live".
      setFps(58 + Math.floor(Math.random() * 3));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/70 backdrop-blur-md">
      <div className="container mx-auto flex h-8 items-center justify-between gap-4 px-4 font-term text-[10px] uppercase tracking-widest text-muted-foreground md:px-8 md:text-[11px] lg:px-16">
        {/* Left — server status */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-foreground">Servers online</span>
        </div>

        {/* Right — clock + FPS (the one place these live) */}
        <div className="flex items-center gap-3">
          <span className="tabular-nums">{time || '--:--:--'}</span>
          <span className="text-border">·</span>
          <span className="text-primary tabular-nums">{fps} FPS</span>
        </div>
      </div>
    </div>
  );
}
