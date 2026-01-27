import { Navbar } from '@/components/home/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { LeaderboardSection } from '@/components/home/LeaderboardSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Footer } from '@/components/home/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LeaderboardSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
