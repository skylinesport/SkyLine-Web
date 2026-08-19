import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

/**
 * Shared shell for the static legal pages (Terms, Privacy). Mirrors the
 * reset-password page's look — hero gradient, back-to-home link, elevated glass
 * card — but sized for reading, with a simple prose scale defined inline (the
 * site has no @tailwindcss/typography plugin).
 */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen hero-gradient px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-3xl"
      >
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="glass-card-elevated p-8 sm:p-10">
          <img src={logo} alt="Skylinesport" className="mb-8 h-10 w-auto dark:invert" />

          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

          <div className="legal-prose mt-8 space-y-6 text-[15px] leading-relaxed text-foreground/90">
            {children}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Questions? Email{' '}
          <a href="mailto:support@skylinesport.in" className="text-primary hover:underline">
            support@skylinesport.in
          </a>
        </p>
      </motion.div>
    </div>
  );
}

/** A titled section within a legal document. */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** A bulleted list styled to match the prose body. */
export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
