import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-4 md:px-8 lg:px-16 pt-24">
      <div className="container mx-auto">
        {/* Massive Typography - Static, no animation */}
        <div className="mb-12">
          <h1 className="text-[clamp(4rem,15vw,14rem)] font-extrabold leading-[0.85] tracking-tighter uppercase">
            <span className="block">LOCA</span>
            <span className="block gold-text">TRACK</span>
          </h1>
        </div>

        {/* Navigation Bar - Static with hover effects only */}
        <div className="flex flex-col md:flex-row border border-border rounded-full overflow-hidden mb-16">
          <Link 
            to="/auth" 
            className="flex-1 py-4 px-8 text-center font-medium hover:bg-muted/50 transition-colors duration-200 border-b md:border-b-0 md:border-r border-border"
          >
            About & Features
          </Link>
          <Link 
            to="/#leaderboard" 
            className="flex-1 py-4 px-8 text-center font-medium hover:bg-muted/50 transition-colors duration-200 border-b md:border-b-0 md:border-r border-border"
          >
            Leaderboard <span className="text-muted-foreground">(Top 10)</span>
          </Link>
          <Link 
            to={user ? "/dashboard" : "/auth"} 
            className="flex-1 py-4 px-8 text-center font-medium hover:bg-muted/50 transition-colors duration-200"
          >
            {user ? "Dashboard" : "Get Started"}
          </Link>
        </div>

        {/* Tagline and Status */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Open for Achievements</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              Track Your Non-Academic Wins.
              <br />
              Build Your Digital Identity.
              <br />
              <span className="text-muted-foreground">Stand Bold.</span>
            </h2>

            <div className="flex flex-wrap gap-3 pt-4">
              {['Sports', 'Arts', 'Volunteering', 'Leadership'].map((tag) => (
                <span 
                  key={tag}
                  className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted/50 transition-colors duration-200 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Achievement Card - Hover effects only */}
          <Link to={user ? "/dashboard" : "/auth?mode=signup"} className="block group">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute top-4 right-4">
                <span className="px-4 py-1.5 bg-foreground text-background text-xs font-semibold rounded-full">
                  JOIN NOW
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold group-hover:gold-text transition-colors duration-200">
                      Start Tracking
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Achievements / Stars
                    </p>
                  </div>
                  <div className="text-6xl font-extrabold gold-text">
                    ★
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
