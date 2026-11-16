import { useEffect, useRef } from 'react';

/**
 * Custom cursor — a precise lime dot plus a larger ring that trails with a
 * little lag and swells over anything clickable. Desktop/fine-pointer only;
 * on touch it renders nothing and the native cursor is untouched.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest('a, button, [role="button"], input, [data-cursor="hover"]');
    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) ring.current?.classList.add('cursor-ring--hover');
    };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) ring.current?.classList.remove('cursor-ring--hover');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.classList.add('has-custom-cursor');
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.classList.remove('has-custom-cursor');
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
