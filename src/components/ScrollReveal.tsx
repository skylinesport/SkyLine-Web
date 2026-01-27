import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

const smoothEase: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

type RevealType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'clip-up';

interface ScrollRevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}

const variants: Record<RevealType, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 40 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: smoothEase, delay },
    }),
  },
  'fade-down': {
    hidden: { opacity: 0, y: -40 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: smoothEase, delay },
    }),
  },
  'fade-left': {
    hidden: { opacity: 0, x: 40 },
    visible: (delay: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: smoothEase, delay },
    }),
  },
  'fade-right': {
    hidden: { opacity: 0, x: -40 },
    visible: (delay: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: smoothEase, delay },
    }),
  },
  'scale': {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (delay: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: smoothEase, delay },
    }),
  },
  'clip-up': {
    hidden: { y: '100%' },
    visible: (delay: number) => ({
      y: 0,
      transition: { duration: 1, ease: smoothEase, delay },
    }),
  },
};

export function ScrollReveal({
  children,
  type = 'fade-up',
  delay = 0,
  className = '',
  once = true,
  margin = '-100px',
}: ScrollRevealProps) {
  const isClip = type === 'clip-up';

  if (isClip) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once, margin }}
          custom={delay}
          variants={variants[type]}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      custom={delay}
      variants={variants[type]}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for groups of items
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  margin?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  }),
};

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true,
  margin = '-50px',
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      custom={staggerDelay}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  type?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale';
}

export function StaggerItem({ children, className = '', type = 'fade-up' }: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: variants[type].hidden,
    visible: {
      ...(variants[type].visible as (delay: number) => object)(0),
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
