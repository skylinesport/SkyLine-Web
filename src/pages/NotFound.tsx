import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="hero-scanlines relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
      {/* soft lime pool */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        <p className="font-term text-xs uppercase tracking-[0.4em] text-muted-foreground">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle animate-pulse" />
          Signal lost
        </p>

        <h1 className="crt-text font-display mt-6 text-[clamp(5rem,22vw,14rem)] font-bold leading-none tracking-tight">
          404
        </h1>

        <p className="mt-4 font-term text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Player not found — this route doesn&apos;t exist
        </p>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-[0_0_30px_-6px_hsl(var(--gold)/0.6)] transition-transform duration-300 hover:scale-[1.04]"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to base
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
