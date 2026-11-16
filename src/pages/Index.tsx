import { Navbar } from '@/components/home/Navbar';
import { HeroBoot } from '@/components/home/HeroBoot';
import { AboutSection } from '@/components/home/AboutSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CommunitySection } from '@/components/home/CommunitySection';
import { Footer } from '@/components/home/Footer';
import { HudBar } from '@/components/home/HudBar';
import { Loader } from '@/components/fx/Loader';

export default function Index() {
  return (
    /* pb-8 keeps the footer clear of the fixed HUD strip at the bottom. */
    <div className="min-h-screen bg-background pb-8">
      <Loader />
      <Navbar />
      <HeroBoot />
      <AboutSection />
      <HowItWorks />
      <FeaturesSection />
      <CommunitySection />
      <Footer />
      <HudBar />
    </div>
  );
}
