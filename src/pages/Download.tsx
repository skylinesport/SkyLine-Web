import { Navbar } from '@/components/home/Navbar';
import { CommunitySection } from '@/components/home/CommunitySection';
import { Footer } from '@/components/home/Footer';
import { HudBar } from '@/components/home/HudBar';

/**
 * Single download landing page — the target of the printed-poster QR code.
 * A QR can't branch by device, so it points here and the visitor taps the
 * store they want. Reuses the homepage's CommunitySection (headline + both
 * store badges, sourced from lib/appLinks) so this never drifts from the
 * site's own download surface. Same chrome as Index for a consistent look.
 */
export default function Download() {
  return (
    /* pb-8 keeps the footer clear of the fixed HUD strip at the bottom. */
    <div className="min-h-screen bg-background pb-8">
      <Navbar />
      <CommunitySection />
      <Footer />
      <HudBar />
    </div>
  );
}
