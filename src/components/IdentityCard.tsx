import { useRef } from 'react';
import { Download, Wifi } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

interface IdentityCardProps {
  name: string;
  userCode: string;
  starRating: number;
  totalAchievements: number;
}

export function IdentityCard({ name, userCode, starRating, totalAchievements }: IdentityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date();
  const memberSince = `${currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${currentDate.getFullYear()}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#0a0a1a',
      });
      
      const link = document.createElement('a');
      link.download = `skyline-${userCode}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Identity card downloaded!');
    } catch (error) {
      toast.error('Failed to download card');
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto overflow-hidden"
        style={{
          aspectRatio: '1.586/1', // Standard card ratio
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Diagonal Stripe Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 11px
            )`,
          }}
        />
        
        {/* Top Border Glow */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
          }}
        />

        {/* Content */}
        <div className="relative h-full p-4 md:p-6 flex flex-col justify-between">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <img 
                src={logo} 
                alt="SkyLine" 
                className="h-6 md:h-10 w-auto invert"
              />
              <div>
                <p className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Elite Member
                </p>
              </div>
            </div>
            
            {/* NFC Icon */}
            <div className="flex flex-col items-center gap-0.5 md:gap-1">
              <Wifi className="w-4 h-4 md:w-6 md:h-6 rotate-90" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span className="text-[6px] md:text-[8px] tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>NFC</span>
            </div>
          </div>

          {/* Member ID */}
          <div className="mt-3 md:mt-6">
            <p className="text-[8px] md:text-[10px] tracking-[0.15em] uppercase mb-0.5 md:mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Member ID
            </p>
            <p 
              className="text-base md:text-xl font-mono font-semibold tracking-[0.1em]"
              style={{
                color: '#ffffff',
              }}
            >
              {userCode}
            </p>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between mt-auto pt-1 md:pt-2">
            {/* Name */}
            <div>
              <p className="text-xs md:text-sm font-semibold tracking-wide uppercase" style={{ color: '#ffffff' }}>
                {name}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 md:gap-6">
              <div className="text-right">
                <p className="text-[8px] md:text-[10px] tracking-[0.15em] uppercase mb-0.5 md:mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Rating
                </p>
                <p 
                  className="text-xs md:text-sm font-bold"
                  style={{ color: '#CBF573' }}
                >
                  {starRating.toFixed(1)}★
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] md:text-[10px] tracking-[0.15em] uppercase mb-0.5 md:mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Since
                </p>
                <p className="text-xs md:text-sm font-bold" style={{ color: '#ffffff' }}>
                  {memberSince}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleDownload} variant="outline" className="gap-2 text-xs md:text-sm">
          <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Download as PNG
        </Button>
      </div>
    </div>
  );
}
