import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorSpotlightProps {
  containerRef: React.RefObject<HTMLElement>;
  size?: number;
  color?: string;
  opacity?: number;
}

export function CursorSpotlight({ 
  containerRef, 
  size = 400, 
  color = 'hsl(var(--primary))',
  opacity = 0.15 
}: CursorSpotlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [containerRef, mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: size,
          height: size,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
        }}
      />
    </motion.div>
  );
}
