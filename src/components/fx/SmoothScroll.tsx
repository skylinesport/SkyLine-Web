import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

/**
 * Momentum (Lenis) smooth scrolling for the whole app — the single biggest
 * "this feels premium" upgrade. Disabled when the visitor prefers reduced
 * motion, in which case scrolling falls back to the browser's native behaviour.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <ReactLenis
      root
      options={{ lerp: 0.09, smoothWheel: !reduced, wheelMultiplier: 1, syncTouch: false }}
    >
      {children}
    </ReactLenis>
  );
}
